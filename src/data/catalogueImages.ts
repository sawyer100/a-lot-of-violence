/*
 * Catalogue images for the home page.
 *
 * To give a script an image, drop a file into src/assets/catalogue/ named
 * after the module's slug, for example "violence-and-shit.jpg". Nothing else
 * needs editing. A module without a file shows an empty slot.
 */
const files = import.meta.glob<string>('../assets/catalogue/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
})

const bySlug = new Map(
  Object.entries(files).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.')), url]),
)

export function catalogueImage(slug: string): string | undefined {
  return bySlug.get(slug) ?? bySlug.get(slug.replace(/-/g, '_'))
}
