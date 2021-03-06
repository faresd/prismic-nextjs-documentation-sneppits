import React from 'react'
import { graphql } from 'gatsby'
import { Link } from 'prismic-reactjs'
import { linkResolver } from 'gatsby-source-prismic-graphql'


const Page = ({ data }) => {
  const prismicContent = data.prismic.allPages.edges[0]
  if (!prismicContent) return null

  const document = prismicContent.node
  return (
    <a href={Link.url(document.document_link, linkResolver)}>Go to page</a>
  )
}

export const query = graphql`
  query {
    prismic {
      allPages(uid: "test-page") {
        edges {
          node {
            page_link {
              _linkType
              ... on PRISMIC_Page {
                title
                description
                _meta {
                  uid
                }
              }
              ... on PRISMIC__ExternalLink {
                url
              }
              ... on PRISMIC__ImageLink {
                _linkType
                url
                height
                name
                width
                size
              }
              ... on PRISMIC__FileLink {
                url
                size
                name
              }
            }
          }
        }
      }
    }
  }
`

export default Page
