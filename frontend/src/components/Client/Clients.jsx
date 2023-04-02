import React from 'react'
import Avatar from 'react-avatar'
import "./Client.css"

const Clients = ({ username }) => {
  return (
    <div className="client">
      <Avatar color='#0F111A' name={username} size={50} round="14px" />
      <span className="username">
        {username}
      </span>
    </div>
  )
}

export default Clients