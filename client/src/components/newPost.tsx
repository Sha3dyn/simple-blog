/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Stack,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem,
    Divider,
    SelectChangeEvent,
    Chip,
} from '@mui/material';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

interface Props {
    token: string
    user: string
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreatePost : React.FC<Props> = (props: Props) : React.ReactElement => {
    const { token, user } = props;
    const [categoryData, setCategoryData] = useState<CategoryData>({ categories: [], error: "", fetched: false });
    const navigate : NavigateFunction = useNavigate();
    const formRef : any = useRef<HTMLFormElement>();
    const categoryRef : any = useRef<HTMLFormElement>();
    const quillRef : any = useRef<any>();
    const [selected, setSelected] = useState<string[]>([]);

    const addNewPost = async (e : React.FormEvent) : Promise<void> => {
        e.preventDefault();

        if(formRef.current?.title.value && quillRef.current.getEditorContents()) {
            const categoryObjects = selected.map((item) => { return { id: item } })

            const conn = await fetch("/api/post", {
                method: "POST",
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    title: formRef.current?.title.value,
                    content: quillRef.current.getEditorContents(),
                    author: user,
                    categories: categoryObjects
                })
            });
            
            if (conn.status === 200) {
                navigate("/");
            }
        }
    }

    const addNewCategory = async (e : React.FormEvent) : Promise<void> => {
        e.preventDefault();

        if(categoryRef.current?.name.value) {
            try {
                const conn = await fetch("/api/handleCategory", {
                    method: "POST",
                    headers: {
                        'Authorization' : `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body : JSON.stringify({
                        name: categoryRef.current?.name.value,
                    })
                });

                const categories = await conn.json();

                if (conn.status === 200) {
                    setCategoryData({ ...categoryData, categories: categories, fetched: true });
                    navigate("/post");
                };
            } catch (e : any) {
                setCategoryData({ ...categoryData, error: "Palvelimeen ei saada yhteyttä", fetched: true });
            }
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

    const handleDelete = async (id: number) => {
        try {
            const conn = await fetch(`/api/handleCategory/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const categories = await conn.json();
                
            if (conn.status === 200) {
                setCategoryData({ ...categoryData, categories: categories, fetched: true });
                navigate("/post");
            }
        } catch (e : any) {
            setCategoryData({ ...categoryData, error: "Palvelimeen ei saada yhteyttä", fetched: true });
        }
        
    };

    useEffect(() => {
        getCategoryData('/api/category');
    }, []);

    const handleChange = (event: SelectChangeEvent<typeof selected>) => {
        const { target: { value } } = event;
        setSelected(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <Container maxWidth="sm">
            <Stack
                component="form"
                onSubmit={addNewCategory}
                ref={categoryRef}
                spacing={2}
                sx={{ marginTop: 4 }}
            >
                <Typography variant="h5">Lisää uusi kategoria</Typography>
                <Stack direction="row" spacing={1}>
                    {categoryData.categories.map((category) => (
                        <Chip key={category.id} label={category.name} variant="outlined" onDelete={() => handleDelete(category.id)} />
                    ))}
                </Stack>
                <TextField 
                    name="name"
                    label="Kategorian nimi"
                    fullWidth
                />
                <Stack direction="row" spacing={2}>
                    <Button href="/">Peruuta</Button>
                    <Button type="submit" variant="contained">Lähetä</Button> 
                </Stack>
                <Divider />
            </Stack>
            <Stack
                component="form"
                onSubmit={addNewPost}
                ref={formRef}
                spacing={2}
                sx={{ marginTop: 4 }}
            >
                <Typography variant="h5">Lisää uusi blogiteksti</Typography>
                <TextField 
                    name="title"
                    label="Otsikko"
                    fullWidth
                />
                <ReactQuill
                    ref={quillRef}
                    style={{
                        height : 200,
                        marginBottom: 50
                    }}
                />
                <FormControl>
                    <InputLabel id="demo-multiple-name-label">Kategoria</InputLabel>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        multiple
                        value={selected}
                        onChange={handleChange}
                        input={<OutlinedInput label="Kategoria" />}
                        MenuProps={MenuProps}
                    >
                    {categoryData.categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <Stack direction="row" spacing={2}>
                    <Button href="/">Peruuta</Button>
                    <Button type="submit" variant="contained">Lähetä</Button> 
                </Stack>
            </Stack>
        </Container>
    )
};

export default CreatePost;