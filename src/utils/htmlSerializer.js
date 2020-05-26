import React from 'react'
import { Elements } from 'prismic-richtext'
import { Link as PrismicLink } from 'prismic-reactjs'
import { Link } from 'gatsby'
import { linkResolver } from './linkResolver'


// -- Function to add unique key to props
const propsWithUniqueKey = function (props, key) {
  console.log(key)
  return Object.assign(props || {}, { key })
}

// -- HTML Serializer
const htmlSerializer = function (type, element, content, children, key) {
  let props = {}

  switch (type) {
    case Elements.heading1: // Heading 1
      return React.createElement('h1', propsWithUniqueKey(props, key), children)

    case Elements.heading2: // Heading 2
      return React.createElement('h2', propsWithUniqueKey(props, key), children)

    case Elements.heading3: // Heading 3
      return React.createElement('h3', propsWithUniqueKey(props, key), children)

    case Elements.heading4: // Heading 4
      return React.createElement('h4', propsWithUniqueKey(props, key), children)

    case Elements.heading5: // Heading 5
      return React.createElement('h5', propsWithUniqueKey(props, key), children)

    case Elements.heading6: // Heading 6
      return React.createElement('h6', propsWithUniqueKey(props, key), children)

    case Elements.paragraph: // Paragraph
      return React.createElement('p', propsWithUniqueKey(props, key), children)

    case Elements.preformatted: // Preformatted
      return React.createElement('pre', propsWithUniqueKey(props, key), children)

    case Elements.strong: // Strong
      return React.createElement('strong', propsWithUniqueKey(props, key), children)

    case Elements.em: // Emphasis
      return React.createElement('em', propsWithUniqueKey(props, key), children)

    case Elements.listItem: // Unordered List Item
      return React.createElement('li', propsWithUniqueKey(props, key), children)

    case Elements.oListItem: // Ordered List Item
      return React.createElement('li', propsWithUniqueKey(props, key), children)

    case Elements.list: // Unordered List
      return React.createElement('ul', propsWithUniqueKey(props, key), children)

    case Elements.oList: // Ordered List
      return React.createElement('ol', propsWithUniqueKey(props, key), children)

    case Elements.image: // Image
      const linkUrl = element.linkTo ? element.linkTo.url || linkResolver(element.linkTo) : null
      const linkTarget = (element.linkTo && element.linkTo.target) ? { target: element.linkTo.target } : {}
      const linkRel = linkTarget.target ? { rel: 'noopener' } : {}
      const img = React.createElement('img', { src: element.url, alt: element.alt || '' })
      return React.createElement(
        'p',
        propsWithUniqueKey({ className: [element.label || '', 'block-img'].join(' ') }, key),
        linkUrl ? React.createElement('a', { href: linkUrl, ...linkTarget, ...linkRel }, img) : img,
      )

    case Elements.embed: // Embed
      props = {
        'data-oembed': element.oembed.embed_url,
        'data-oembed-type': element.oembed.type,
        'data-oembed-provider': element.oembed.provider_name,
        ...(element.label ? { className: element.label } : {}),
      }
      const embedHtml = React.createElement('div', { dangerouslySetInnerHTML: { __html: element.oembed.html } })
      return React.createElement('div', propsWithUniqueKey(props, key), embedHtml)

    case Elements.hyperlink: // Hyperlinks

      let result = ''
      const url = PrismicLink.url(element.data, linkResolver)
      if (element.data.link_type === 'Document') {
        result = <Link to={url} key={key}>{ content }</Link>
      } else {
        const targetAttr = element.data.target ? { target: element.data.target } : {}
        const relAttr = element.data.target ? { rel: 'noopener' } : {}
        props = { href: element.data.url || linkResolver(element.data), ...targetAttr, ...relAttr }
        result = React.createElement('a', propsWithUniqueKey(props, key), children)
      }
      return result

    case Elements.label: // Label
      props = element.data ? ({ className: element.data.label }) : {}
      return React.createElement('span', propsWithUniqueKey(props, key), children)

    case Elements.span: // Span
      if (content) {
        return content.split('\n').reduce((acc, p) => {
          if (acc.length === 0) {
            return [p]
          }
          const brIndex = (acc.length + 1) / 2 - 1
          const br = React.createElement('br', propsWithUniqueKey({}, brIndex))
          return acc.concat([br, p])
        }, [])
      }
      return null


    default: // Always include a default that returns null
      return null
  }
}

export default htmlSerializer
