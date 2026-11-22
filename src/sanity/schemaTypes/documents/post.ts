import { defineType, defineField, defineArrayMember } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Philosophy', value: 'Philosophy' },
          { title: 'Living', value: 'Living' },
          { title: 'Investment', value: 'Investment' },
          { title: 'Community', value: 'Community' },
          { title: 'Sustainability', value: 'Sustainability' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      type: 'string',
      description: 'Display date (e.g. OCT 25, 2026)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'string',
      initialValue: 'VanaTvam Team',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'img',
      type: 'string',
      title: 'Hero Image Path / URL',
      description: 'Local web path or image URL (e.g. /Blogs-content/...)',
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      title: 'Uploaded Hero Image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body (Rich Text)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Blocks (Structured)',
      description: 'Structured blocks from migrated content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contentBlock',
          fields: [
            defineField({
              name: 'type',
              type: 'string',
              options: {
                list: [
                  { title: 'Paragraph (p)', value: 'p' },
                  { title: 'Heading 3 (h3)', value: 'h3' },
                  { title: 'Heading 4 (h4)', value: 'h4' },
                  { title: 'Quote (quote)', value: 'quote' },
                  { title: 'Bullet List (ul)', value: 'ul' },
                  { title: 'Numbered List (ol)', value: 'ol' },
                  { title: 'Divider (hr)', value: 'hr' },
                  { title: 'Image (img)', value: 'img' },
                ],
              },
            }),
            defineField({
              name: 'text',
              type: 'text',
            }),
            defineField({
              name: 'src',
              type: 'string',
            }),
            defineField({
              name: 'alt',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              type: 'type',
              text: 'text',
              src: 'src',
            },
            prepare({ type, text, src }) {
              return {
                title: `[${(type || 'p').toUpperCase()}] ${text ? text.slice(0, 50) + '...' : src || ''}`,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
})

