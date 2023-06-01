import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Header.css'

function Header() {
  return (
    
    <div>
         <header class="header">
        <h1>Hello, World!</h1>
        <p>This is a creative Bootstrap header with a centered title and a background image.</p>
        <a href="#" class="btn btn-primary">Get Started</a>
    </header>
    </div>
  )
}

export default Header