"use client"
import React from 'react'
import { TextField,TextArea } from '@radix-ui/themes'
import classname from 'classnames';
import { Button } from '@radix-ui/themes';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const newIssue = () => {
  return (
    <div className='max-w-xl space-y-3'>
    <TextField.Root>
    <TextField.Input placeholder="Title" />
    </TextField.Root>
    <SimpleMDE/>
    <Button>Submit New Isuue</Button>
    </div>
  )
}

export default newIssue