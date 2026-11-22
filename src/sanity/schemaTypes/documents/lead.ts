import { defineType, defineField } from 'sanity'

export const leadType = defineType({
  name: 'lead',
  title: 'Lead Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'project',
      type: 'string',
      title: 'Project of Interest',
    }),
    defineField({
      name: 'preferredDate',
      type: 'string',
      title: 'Preferred Visit Date',
    }),
    defineField({
      name: 'message',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'source',
      type: 'string',
      title: 'Form Source',
      description: 'Which form/page this lead came from',
      options: {
        list: [
          { title: 'Contact Page', value: 'contact' },
          { title: 'Book a Visit', value: 'book-a-visit' },
          { title: 'Brochure Download', value: 'brochure' },
          { title: 'Investment Page', value: 'investment' },
          { title: 'Home Page Form', value: 'home-form' },
          { title: 'Madhuvana Page Form', value: 'madhuvana-form' },
          { title: 'Brindavana Page Form', value: 'brindavana-form' },
          { title: 'Ishavana Page Form', value: 'ishavana-form' },
          { title: 'Anantavana Page Form', value: 'anantavana-form' },
        ],
      },
    }),
    defineField({
      name: 'page',
      type: 'string',
      title: 'Submitted On Page',
      description: 'Path of the page the form was submitted from',
    }),
    defineField({
      name: 'landingPage',
      type: 'string',
      title: 'Landing Page',
      description: 'First page of the visit',
    }),
    defineField({ name: 'referrer', type: 'string', title: 'Referrer' }),
    defineField({ name: 'utmSource', type: 'string', title: 'Campaign Source (utm_source)' }),
    defineField({ name: 'utmMedium', type: 'string', title: 'Campaign Medium (utm_medium)' }),
    defineField({ name: 'utmCampaign', type: 'string', title: 'Campaign Name (utm_campaign)' }),
    defineField({ name: 'utmTerm', type: 'string', title: 'Campaign Term (utm_term)' }),
    defineField({ name: 'utmContent', type: 'string', title: 'Campaign Content (utm_content)' }),
    defineField({
      name: 'submittedAt',
      type: 'datetime',
      title: 'Submitted At',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'project',
      description: 'phone',
    },
  },
})
