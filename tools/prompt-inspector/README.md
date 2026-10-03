# Prompt Inspector

A small local Go debugging proxy for inspecting OpenAI-compatible chat-completion requests.

It is useful when testing the JanitorAI scripts in this repository because it lets you see the prompt/messages sent to a compatible API endpoint and check whether markers such as `[HISTORICAL EQUIPMENT]`, `[ACTION VARIETY]`, and `[DYNAMIC ESCALATION]` appear.

## Run

Requires Go 1.22+.

```sh
cd tools/prompt-inspector
go run .
```

The server listens on `127.0.0.1:8080`.

Health check:

```text
GET http://127.0.0.1:8080/health
```

Chat-completion endpoint:

```text
POST http://127.0.0.1:8080/v1/chat/completions
```

## Capture-only mode

By default, Prompt Inspector prints the request and deliberately returns an error instead of sending it anywhere. This is useful for checking a generated prompt without accidentally making a provider request.

## Forwarding mode

To inspect a request and then forward it to an OpenAI-compatible provider:

```sh
go run . -upstream https://YOUR-PROVIDER-BASE-URL
```

The inspector forwards the request to `<upstream>/v1/chat/completions` and relays the provider response.

Only use an upstream you trust. Requests may contain character cards, chat history, prompts, and credentials in HTTP headers.

## Current limitations

- Terminal output only.
- No persistence or searchable history.
- Assumes an OpenAI-compatible `/v1/chat/completions` request shape.
- Streaming responses are relayed but the tool does not provide a special streaming UI.

These limitations are intentionally documented so they can become normal GitHub issues and contributions.


## Optional Rust redaction

Build the bundled redactor:

```sh
cd tools/prompt-inspector/redactor
cargo build --release
```

Then start Prompt Inspector with it:

```sh
cd ..
go run . -redactor ./redactor/target/release/prompt-redactor
```

The Go server pipes displayed prompt text through the Rust helper before printing it. Redaction affects terminal display only; forwarding still uses the original request body so enabling the helper does not silently alter provider requests.

The bundled redactor currently recognizes several common credential shapes, including OpenAI-style `sk-` keys, GitHub `ghp_` and `github_pat_` tokens, Slack-style `xox*` tokens, AWS-style `AKIA` identifiers, Bearer/Basic authorization values, and common `api_key` / `access_token` / `token` key-value forms.

Redaction is best-effort, not a guarantee that output is safe to publish. Providers can use credential formats the tool does not recognize, so inspect captured output before sharing it.
