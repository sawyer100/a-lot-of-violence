use std::io::{self, Read};

const SECRET_KEYS: &[&str] = &[
    "authorization",
    "api_key",
    "api-key",
    "apikey",
    "access_token",
    "access-token",
    "token",
];

fn looks_like_secret(value: &str) -> bool {
    let v = value.trim_matches(|c: char| "'\"{},[]()".contains(c));
    let lower = v.to_ascii_lowercase();

    lower.starts_with("sk-")
        || lower.starts_with("ghp_")
        || lower.starts_with("github_pat_")
        || lower.starts_with("xoxb-")
        || lower.starts_with("xoxp-")
        || lower.starts_with("xapp-")
        || lower.starts_with("akia")
}

fn redact(input: &str) -> String {
    let mut out = Vec::new();
    let words: Vec<&str> = input.split_whitespace().collect();
    let mut i = 0;

    while i < words.len() {
        let word = words[i];
        let normalized = word
            .trim_matches(|c: char| "'\"{},[]()".contains(c))
            .to_ascii_lowercase();

        if normalized == "bearer" || normalized == "basic" {
            out.push(word.to_string());
            if i + 1 < words.len() {
                out.push("[REDACTED]".to_string());
                i += 2;
                continue;
            }
        }

        let key = normalized.trim_end_matches(':').trim_end_matches('=');
        if SECRET_KEYS.contains(&key) && i + 1 < words.len() {
            out.push(word.to_string());
            out.push("[REDACTED]".to_string());
            i += 2;
            continue;
        }

        if let Some((key, _value)) = word.split_once('=') {
            if SECRET_KEYS.contains(&key.to_ascii_lowercase().as_str()) {
                out.push(format!("{}=[REDACTED]", key));
                i += 1;
                continue;
            }
        }

        if looks_like_secret(word) {
            out.push("[REDACTED]".to_string());
        } else {
            out.push(word.to_string());
        }
        i += 1;
    }

    out.join(" ")
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).expect("read stdin");
    println!("{}", redact(&input));
}

#[cfg(test)]
mod tests {
    use super::redact;

    #[test]
    fn redacts_openai_style_key() {
        assert_eq!(redact("token sk-example"), "token [REDACTED]");
    }

    #[test]
    fn redacts_bearer_credentials() {
        assert_eq!(
            redact("Authorization: Bearer abc123secret"),
            "Authorization: Bearer [REDACTED]"
        );
    }

    #[test]
    fn redacts_common_github_tokens() {
        assert_eq!(redact("github_pat_example"), "[REDACTED]");
        assert_eq!(redact("ghp_example"), "[REDACTED]");
    }

    #[test]
    fn redacts_slack_style_tokens() {
        assert_eq!(redact("xoxb-example-token"), "[REDACTED]");
    }

    #[test]
    fn redacts_key_value_credentials() {
        assert_eq!(redact("api_key=supersecret"), "api_key=[REDACTED]");
    }

    #[test]
    fn preserves_normal_prompt_text() {
        assert_eq!(
            redact("The character opens the old wooden door."),
            "The character opens the old wooden door."
        );
    }
}
