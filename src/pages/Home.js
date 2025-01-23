import { Link } from "react-router-dom"
import { NavBarCustom } from "../components/navBarCustom";
import * as React from 'react';



export default function Home(){
    return (
<div>
        
        <h1>Home Page</h1>
        <h2>
        <Link to="/about">
          <li>About</li>
        </Link>

      </h2>
</div>
    )
}