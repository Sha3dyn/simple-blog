/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Button
} from '@mui/material';
import Sidebar from './sidebar';
import Bloglist from './bloglist';

interface Props {
    token: string
    user: string
}

interface BlogData {
    posts: Array<Post>
    error: string
    fetched: boolean
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

interface CategoryData {
    categories: Array<Category>
    error: string
    fetched: boolean
}

interface Category {
    id: number
    name: string
    _count: {
        posts: number
    }
}

const Blog : React.FC<Props> = (props: Props) : React.ReactElement => {
    const { token, user } = props;
    const [data, setData] = useState<BlogData>({ posts: [], error: "", fetched: false });
    const [categoryData, setCategoryData] = useState<CategoryData>({ categories: [], error: "", fetched: false });

    const getData = async (url: string) : Promise<void> => {
      try {
            const conn = await fetch(url);
            const posts = await conn.json();
  
            if(conn.status === 200) {
              setData({ ...data, posts: posts, fetched: true });
            };
      } catch (e : any) {
        setData({ ...data, error: "Palvelimeen ei saada yhteyttä", fetched: true });
      }
    }

    const getCategoryData = async (url: string) : Promise<void> => {
        try {
              const conn = await fetch(url);
              const categories = await conn.json();
    
              if(conn.status === 200) {
                setCategoryData({ ...categoryData, categories: categories, fetched: true });
              };
        } catch (e : any) {
          setCategoryData({ ...categoryData, error: "Palvelimeen ei saada yhteyttä", fetched: true });
        }
    }

    const filterByCategory = async (category: number) : Promise<void> => {
        try {
          const conn = await fetch(`/api/blog/filter/${category}`);
          const posts = await conn.json();
  
          if(conn.status === 200) {
            setData({ ...data, posts: posts, fetched: true });
          };
        } catch (e : any) {
          setData({ ...data, error: "Palvelimeen ei saada yhteyttä", fetched: true });
        }
    }

    useEffect(() => {
      getData('/api/blog');
      getCategoryData('/api/category');
    }, []);

    return (
        <Container maxWidth="lg">
            <Grid container spacing={5} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                {user && token && user !== "null" && token !== "null" ? <Button variant="contained" href="/post" sx={{ maxWidth: "20%" }}>Uusi kirjoitus</Button> : null}
              </Grid>
                <Bloglist data={data} />
                <Sidebar
                    title="Alena Tech"
                    description="Tarinoita koodaamisesta, tekniikasta, valokuvauksesta ja grafiikasta"
                    categoryData={categoryData}
                    data={data}
                    filterByCategory={filterByCategory}
                />
            </Grid>
        </Container>
    )
}

export default Blog;