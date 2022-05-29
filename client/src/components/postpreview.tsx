import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    Divider,
    Stack,
} from '@mui/material';
import {
    Person,
    LocalOffer,
    CalendarToday,
} from '@mui/icons-material';
import CommentIcon from '@mui/icons-material/Comment';

interface Props {
    post: Post
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

const PostPreview : React.FC<Props> = (props: Props) : React.ReactElement => {
    const { post } = props;

    const printDateTime = (date: Date) => {
        const timestamp : Date = new Date(date);
        const day = timestamp.toLocaleDateString("Fi-fi", { day: "2-digit", month: "2-digit", year: "numeric" });
        const time = timestamp.toLocaleTimeString("Fi-fi", { hour: "2-digit", minute: "2-digit" });

        return `${day} klo ${time}`;
    }

    return (
        <Card sx={{ maxHeight: 600 }}>
            <CardMedia
                component="img"
                height="360"
                image="/oletuskuva.jpg"
                alt="default image"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {post.title}
                </Typography>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                >
                    <Stack direction="row" spacing={1}>
                        <Person fontSize="small" color="secondary" />
                        <Typography variant="body2" color="text.secondary">{post.author.username}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <CalendarToday fontSize="small" color="secondary" />
                        <Typography variant="body2" color="text.secondary">{printDateTime(post.createdAt)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <LocalOffer fontSize="small" color="secondary" />
                        <Typography variant="body2" color="text.secondary">
                            {post.categories.length > 0 ? post.categories.map((category, index) => {
                                if(index < post.categories.length - 1) {
                                   return `${category.name}, `
                                } else {
                                    return category.name
                                }
                            }) : ""}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <CommentIcon fontSize="small" color="secondary" />
                        <Typography variant="body2" color="text.secondary">{post._count.comments}</Typography>
                    </Stack>
                </Stack>
                <Typography noWrap>
                    <span dangerouslySetInnerHTML={ { __html: post.content } } />
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" href={`/${post.id}`}>Lue lisää</Button>
            </CardActions>
        </Card>
    )
}

export default PostPreview;