import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Box
} from '@mui/material';

interface Props {
    title: string
    description: string
    data: {
      posts: Array<Post>
      error: string
      fetched: boolean
    }
    categoryData: {
        categories: Array<Category>
        error: string
        fetched: boolean
    }
    filterByCategory: any
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
    _count: {
        posts: number
    }
}

const Sidebar : React.FC<Props> = (props: Props) : React.ReactElement => {
    const { title, description, categoryData, data, filterByCategory } = props;

    const printDate = (date: Date) => {
        const timestamp : Date = new Date(date);
        const day = timestamp.toLocaleDateString("Fi-fi", { day: "2-digit", month: "2-digit", year: "numeric" });

        return `${day}`;
    }

    return (
        <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.200' }}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Typography>{description}</Typography>
            </Paper>
            <Box sx={{ p: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Blogitekstit
                </Typography>
                <List>
                    {data.posts.length > 0
                        ? data.posts.map((post, index) =>
                          <ListItem divider={index < data.posts.length - 1 ? true : false} disableGutters key={post.id}>
                            <ListItemButton disableGutters href={`/${post.id}`}>
                                <ListItemText primary={post.title} secondary={printDate(post.createdAt)} />
                            </ListItemButton>
                          </ListItem>
                        )
                        : null}
                </List>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Kategoriat
                </Typography>
                <List>
                    {categoryData.categories.length > 0
                        ? categoryData.categories.map((category) =>
                            category._count.posts > 0 
                            ? <ListItem dense disableGutters key={category.id}>
                                <ListItemButton disableGutters onClick={() => filterByCategory(category.id)}>
                                    <ListItemText secondary={`${category.name} (${category._count.posts})`} />
                                </ListItemButton>
                             </ListItem>
                            : null
                        )
                        : null}
                </List>
            </Box>
        </Grid>
    )
}

export default Sidebar;