/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  const projectTemplate = path.resolve(`src/templates/projectTemplate.js`);

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: projectTemplate,
        context: {slug: node.fields.slug}, // additional data can be passed via context
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;
    if (node.internal.type === `MarkdownRemark`) {
      const slug = createFilePath({ node, getNode, basePath: `pages` });
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });
    }
  };