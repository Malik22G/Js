"use client"
import React from 'react'
import { TextField,TextArea } from '@radix-ui/themes'
import classname from 'classnames';
import { Button } from '@radix-ui/themes';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form"
import axios from 'axios';
import { useRouter } from 'next/navigation';


type IssueFormInputs = {
  title: string
  description: string
}

const newIssue = () => {
  const router = useRouter()
  const {
    register,
    control,
    handleSubmit
  } = useForm<IssueFormInputs>();
  

  return (
    <form className='max-w-xl space-y-3' 
    onSubmit={handleSubmit(async (data)=> {
    try{
      await axios.post("/api/issues",data)
      router.push('/issues')
    }
    catch(error){
      console.log(error);
    }
  })}>
    <TextField.Root>
    <TextField.Input placeholder="Title" {...register("title")}/>
    </TextField.Root>
    <Controller
    name = "description"
    control = {control}
    render = {({ field }) => <SimpleMDE placeholder='Description' {...field}/>}
    />
    <Button>Submit New Isuue</Button>
    </form>
  )
}

export default newIssue