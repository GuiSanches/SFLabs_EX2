import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import axios from 'axios'

class IndexPage extends React.Component {
  state = {
    "_id": undefined,
    "name": undefined,
    "email": undefined,
    "password": undefined
  }

  handleChange = event => {
    switch (event.target.name) {
      case 'name':
        this.setState({ name: event.target.value });
        break;
      case 'email':
        this.setState({ email: event.target.value });
        break;
      case 'password':
        this.setState({ password: event.target.value });
        break;

      default:
        break;
    }
  }

  handleSubmit = async event => {
    event.preventDefault();

    axios.post('http://10.0.0.109:8001/api/user/', this.state).then(res => {
    })
  }

  getAllUsers = async event => {
    event.preventDefault();

    axios.get('http://10.0.0.109:8001/api/users').then(res => {
      this.setState({users: res.data})
    })
  }

  render() {
    const items = this.state.users === undefined ? [] : this.state.users.map( item => {
      return <li> {`Nome: ${item.name} email: ${item.email}`} </li>;
    });
    return (
      <Layout>
        <SEO title="Home" />
        <h1>Preencha os dados de usuário</h1>
        <form onSubmit={this.handleSubmit} method="post">
          <div>
            <label htmlFor="name">Nome: </label>
            <input onChange={this.handleChange} type="text" placeholder="Nome" name="name" id="name"></input>
          </div>
          <div>
            <label htmlFor="email">Email: </label>
            <input onChange={this.handleChange} type="email" placeholder="seu_email@teste.com" name="email" id="email"></input>
          </div>
          <div>
            <label htmlFor="password">Senha: </label>
            <input onChange={this.handleChange} type="password" placeholder="Senha" name="password" id="password"></input>
          </div>
          <button type="submit" value="submit">submit</button>
        </form>
        <a onClick={this.getAllUsers} href="">Veja todos</a>
        <ul>{items}</ul>



        <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
          <Image />
        </div>
        <Link to="/page-2/">Go to page 2</Link>

        
      </Layout>
    )
  }
}


export default IndexPage
