# FSE Theme + Headless Menu Integration Guide

This guide explains how to use a modern Full Site Editing (FSE) WordPress theme while keeping your navigation menus queriable for a headless React frontend (e.g., via WPGraphQL).

---

## 1. Use a Modern FSE (Block) Theme
- Install and activate a block-based theme (e.g., Twenty Twenty-Three, Frost, Ollie, etc.).

## 2. Manage Menus in Classic Menu System
- Go to **Appearance > Menus** in the WordPress admin.
- Create and manage your navigation menu as usual (add pages, custom links, etc.).
- This menu will be available to WPGraphQL for querying.

## 3. Add a Navigation Block in the Site Editor
- Go to **Appearance > Editor** (Site Editor).
- Add a **Navigation** block to your header template.
- When prompted, **import** your classic menu into the Navigation block.
- This allows you to visually edit the menu in the block editor, but keeps the classic menu in sync for headless use.

## 4. Keep Menus in Sync
- When you update the classic menu (add/remove items), re-import it into the Navigation block if needed.
- Editors can use the Site Editor for visual changes, but always ensure the classic menu is the source of truth for the headless frontend.

## 5. Query Menus in Your React App
- Use WPGraphQL’s `menus` endpoint to fetch menu items:

```graphql
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
```

- Render the menu in your React header as needed.

## 6. (Optional) Advanced: Custom Post Type for Navigation
- For more control, create a custom post type for navigation items and query it directly.
- This is useful for complex nav structures, metadata, or multi-level menus.

## 7. (Optional) Expose Navigation Block Data to GraphQL
- Some plugins (e.g., `wp-graphql-navigation-block`) attempt to expose Navigation block data, but support may vary.
- For most projects, the classic menu system is more reliable for headless use.

---

**Summary:**
- Use a block theme for modern editing and block support.
- Manage menus in the classic menu system for GraphQL querying.
- Import the classic menu into the Navigation block for visual editing.
- Query and render menus in your React app as needed.

This approach gives you the best of both worlds: modern block-based editing and reliable, queriable navigation for your headless frontend.
