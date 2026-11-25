export const postsQuery = `*[_type == "post"] | order(_createdAt desc) {
  _id,
  "id": slug.current,
  title,
  date,
  author,
  "updatedAt": _updatedAt,
  img,
  coverImage,
  "coverImageUrl": coalesce(coverImage.asset->url, coverImage.url, null),
  category,
  excerpt,
  contentBlocks
}`

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  "id": slug.current,
  title,
  date,
  author,
  "updatedAt": _updatedAt,
  img,
  coverImage,
  "coverImageUrl": coalesce(coverImage.asset->url, coverImage.url, null),
  category,
  excerpt,
  body[] {
    ...,
    _type == "image" => {
      ...,
      "url": coalesce(asset->url, url, null)
    }
  },
  contentBlocks
}`

export const postSlugsQuery = `*[_type == "post" && defined(slug.current)][].slug.current`
