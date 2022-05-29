/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    Divider,
    Stack,
    List,
    ListItem,
    ListItemText,
    TextField,
    Container,
} from '@mui/material';
import {
    Person,
    LocalOffer,
    CalendarToday,
} from '@mui/icons-material';
import CommentIcon from '@mui/icons-material/Comment';
import { useParams } from 'react-router-dom';

interface Props {
    token: string
    user: string
}

interface PostData {
    post: Post,
    error: string,
    fetched: boolean
}

interface Post {
    id: number
    title: string
    content: string
    author: { username: string }
    createdAt: Date
    updatedAt: Date
    userId: number
    comments: Array<Comment>
    categories: Array<Category>
}

interface Comment {
    id: number
    content: string
    username: string
    timestamp: Date
    postId: number
}

interface Category {
    id: number
    name: string
  }

const PostView : React.FC<Props> = (props: Props) : React.ReactElement => {
    const { id } = useParams();
    const { token, user } = props;
    const [data, setData] = useState<PostData>({
                                                post: {
                                                    id: 0,
                                                    title: "",
                                                    content: "",
                                                    author: { username: "" },
                                                    createdAt: new Date(),
                                                    updatedAt: new Date(),
                                                    userId: 0,
                                                    comments: [],
                                                    categories: []
                                                },
                                                error: "",
                                                fetched: false
                                            });
    const formRef : any = useRef<HTMLFormElement>();

    const addNewComment = async (e : React.FormEvent) : Promise<void> => {
        e.preventDefault();
                                        
        if(formRef.current?.content.value) {
            const conn = await fetch("/api/comment", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    content: formRef.current?.content.value,
                    username: formRef.current?.username.value || "Anonyymi",
                    postId: id,
                })
            });

            // Clear input values
            formRef.current.content.value = "";
            formRef.current.username.value = "";
            
            if (conn.status === 200) {
                // Renew data
                getData(`/api/blog/${id}`);
            }
        }
    }
    
    const getData = async (url: string) : Promise<void> => {
      try {
            const conn = await fetch(url);
            const post = await conn.json();
  
            if(conn.status === 200) {
              setData({ ...data, post: post, fetched: true });
            };
      } catch (e : any) {
        setData({ ...data, error: "Palvelimeen ei saada yhteyttä", fetched: true });
      }
    }

    useEffect(() => {
        getData(`/api/blog/${id}`);
    }, []);

    const printDateTime = (date: Date) => {
        const timestamp : Date = new Date(date);
        const day = timestamp.toLocaleDateString("Fi-fi", { day: "2-digit", month: "2-digit", year: "numeric" });
        const time = timestamp.toLocaleTimeString("Fi-fi", { hour: "2-digit", minute: "2-digit" });

        return `${day} klo ${time}`;
    }

    return (
        <Container maxWidth="lg">
            <Stack spacing={5} sx={{ mt: 5 }}>
                <Card>
                    <CardMedia
                        component="img"
                        height="100%"
                        image="/oletuskuva.jpg"
                        alt="default image"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {data.post.title}
                        </Typography>
                        <Stack
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem />}
                            spacing={2}
                        >
                            <Stack direction="row" spacing={1}>
                                <Person fontSize="small" color="secondary" />
                                <Typography variant="body2" color="text.secondary">{data.post.author.username}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <CalendarToday fontSize="small" color="secondary" />
                                <Typography variant="body2" color="text.secondary">{printDateTime(data.post.createdAt)}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <LocalOffer fontSize="small" color="secondary" />
                                <Typography variant="body2" color="text.secondary">
                                {data.post.categories.length > 0 ? data.post.categories.map((category, index) => {
                                    if(index < data.post.categories.length - 1) {
                                    return `${category.name}, `
                                    } else {
                                        return category.name
                                    }
                                }) : ""}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <CommentIcon fontSize="small" color="secondary" />
                                <Typography variant="body2" color="text.secondary">{data.post.comments.length}</Typography>
                            </Stack>
                        </Stack>
                        <Typography noWrap>
                            <span dangerouslySetInnerHTML={ { __html: data.post.content } } />
                        </Typography>
                    </CardContent>
                    {user && token && user !== "null" && token !== "null"
                      ? <CardActions>
                            <Button size="small" href={`/post/${id}`}>Muokkaa</Button>
                            <Button size="small" href="/">Poista</Button>
                        </CardActions>
                      : null
                    }
                </Card>
                <Stack
                    spacing={2}
                    component="form"
                    ref={formRef}
                    onSubmit={addNewComment}
                    sx={{ marginBottom: 2 }}
                >
                    <Typography variant="h6">Kommentit</Typography>
                    <List>
                        {data.post.comments.length > 0
                            ? data.post.comments.map((comment) =>
                                <ListItem
                                    disableGutters
                                    divider
                                    key={comment.id}
                                >
                                    <ListItemText
                                        primary={comment.content}
                                        secondary={`${printDateTime(comment.timestamp)}, ${comment.username}`}
                                    />
                                </ListItem> )
                            : <Typography>Ei vielä kommentteja</Typography>
                        }
                    </List>
                    <TextField
                        id="content"
                        name="content"
                        label="Kommentti"
                        placeholder="Kirjoita kommentti..."
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                    />
                    <TextField
                        name="username"
                        label="Käyttäjänimi"
                        fullWidth
                    />
                    <Button variant="contained" type="submit">Lähetä kommentti</Button>
                </Stack>
            </Stack>
        </Container>
    )
}

export default PostView;