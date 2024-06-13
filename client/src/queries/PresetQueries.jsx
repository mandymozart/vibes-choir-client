import { gql } from '@apollo/client';

export const GET_PRESETS = gql`
query GetPresetsQuery {
    presetsCount
    presets {
      id,
      slug,
      author {
        id
        name
      },
      tags {
        name
      },
      groupsCount,
      groups {
        id
        name
        channel
      },
      contents {
        id
        note
        media {
          id
          type
          file {
            filename
            filesize
            url
          }
          image {
            id
            width
            height
            url
            filesize
            extension 
          }
          text
          url
        }
      },
      sessions {
        id
        slug
      }
    }
  }
  `