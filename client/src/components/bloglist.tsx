/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Grid, Typography, Stack } from '@mui/material';
import PostPreview from './postpreview';

interface Props {
  data: {
    posts: Array<Post>
    error: string
    fetched: boolean
  }
}

interface Comment {
  id: number
  content: string
  username: string
  timestamp: Date
  postId: number
}

interface Post {
  id: number
  title: string
  content: string
  author: { username: string }
  _count: { comments: number }
  createdAt: Date
  updatedAt: Date
  userId: number
  comments: Array<Comment>
  categories: Array<Category>
}

interface Category {
  id: number
  name: string
}

const Bloglist : React.FC<Props> = (props: Props) : React.ReactElement => {
    const { data } = props;

    return (
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {data.posts && data.posts.length > 0
              ? data.posts.map((post) => (
                <PostPreview post={post} key={post.id}/>))
              : <Typography>Ei julkaistuja blogikirjoituksia</Typography>
            }
          </Stack>
        </Grid>
    )
}

export default Bloglist;