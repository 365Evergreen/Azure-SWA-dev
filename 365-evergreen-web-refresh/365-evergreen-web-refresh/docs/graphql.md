## Navigation

query glbNav {
  menus(where: {location: MENU_1}) {
    nodes {
      menuItems {
        nodes {
          label
          url
        }
      }
    }
  }
}

## Features

query services {
  services {
    nodes {
      features {
        featureName
      }
      title
      content(format: RENDERED)
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
}

## All posts

query allPosts {
  posts {
    edges {
      node {
        id
        title
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        slug
        content(format: RENDERED)
      }
    }
  }
}

## What we do


 query whatWeDo {
  e365page(id: "cG9zdDo0OTM=") {
    id
    title
    uri
    slug
    content(format: RENDERED)
    blocks(dynamicContent: true, attributes: true, htmlContent: true)
  }
}