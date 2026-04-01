# All accordions by component
query communicationAccordions {
  e365Accordions(first: 200) {
    nodes {
      id
      title
      accordionFields {
        componentname
        label
        items {
          nodes {
            __typename
            id
            slug
            ... on AccordionItem {
              content
            }
          }
        }
        imageurl {
          node {
            id
          link
uri          }
        }
        sortby
      }
    }
  }
}

1. On page load the button labels are populated with the accordionsField label value, e.g., "Stay connected" The image to display next to ech accordion is in the imageurl field as link
2. The button is used to filter the accordions to show accordionItems that appear in the itemsproperty of that query.
3. A column called sortOrder exists in the accordionItems CPT and should be used for display order
4. The first accodion is selected by default

So onload, the accordion "Stay connected" should be open and display:
Teams keeps everyone in the loop
SharePoint brings the details together
Copilot ties it all into one story