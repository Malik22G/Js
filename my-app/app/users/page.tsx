import React from 'react'

interface User{
    id:number,
    name:string
    email:string
}

const UserPage = async () => {
    const res = await fetch(
        "https://jsonplaceholder.typicode.com/users",
    {cache: "no-store"});
    const users: User[] = await res.json();

  return (
      <div className="overflow-x-auto">
      <h1>Users</h1>
      <table className='table'>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
        {users.map(user => (
        <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
        </tr> ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserPage