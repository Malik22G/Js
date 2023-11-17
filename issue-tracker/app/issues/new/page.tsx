"use client"
import React from 'react'
import { TextField,TextArea } from '@radix-ui/themes'
import classname from 'classnames';
import { Button } from '@radix-ui/themes';

const newIssue = () => {
  return (
    <div className='max-w-xl space-y-3'>
    <TextField.Root>
    <TextField.Input placeholder="Title" />
    </TextField.Root>
    <TextArea size="2" placeholder="Description.." />
    <Button>Submit New Isuue</Button>
    </div>
  )
}

export default newIssue