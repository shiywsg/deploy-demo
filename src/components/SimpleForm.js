import styles from './SimpleForm.module.css';
import { useState } from 'react';
//import joi from joi-browser
import Joi from "joi-browser";
//this allow us to create schemas as well as validate the entries

function SimpleForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  })
  const [error, setError] = useState({});

  //schema - the rules
  const schema = {
    name: Joi.string().min(1).max(20).required(), //what is the rule? must be a string ,min 1, max 20, is required
    email: Joi.string().email().required(),
    age: Joi.number().min(1).max(100).required(),
  }



  /*
    Input box onChange handler + validation
  */

  const handlerOnChange = (event) => {
    const {name, value} = event.target;
    const errorMessage = validate(event);
    let errorData = {...error};

    if (errorMessage) {
      errorData[name] = errorMessage;
    } else {
      delete errorData[name];
    }

    let userData = {...user};
    userData[name] = value;

    setUser(userData);
    setError(errorData);
    if (process.env.NODE_ENV === 'development') {
      console.log('userData', userData);}
  }

  const validate = (event) => {
    const {name, value} = event.target; //name -> name attribute, value -> the content of "name"; this is a "structure"(data type)
    const objToCompare = {[name]: value}; //use the [] to get the content of "name", because here is an object, "name" is the key; or we can say "name" is the subscript of a such "array", use [] to quote it.
    const subSchema = {[name] : schema[name]}; //

    //actual validation
    const result = Joi.validate(objToCompare, subSchema);
    //get error and return
    const {error} = result;
    return error ? error.details[0].message : null;
    //note, the validate is done per input
  }

  /*
    Submit handler
  */
  const handlerOnSubmit = (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, {abortEarly: false}); // Replace null with JOI validation here
    const {error} = result;
    if (!error) {
      console.log(user);
      return user;
    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }
      setError(errorData);
      console.log(errorData);
      return errorData
    }
  }
  
  return (
    <div className={styles.container}>
      <h2>SimpleForm</h2>
      <form onSubmit={handlerOnSubmit}>
        <label>Name:</label>
        <input type='text' name='name' placeholder='Enter name' onChange={handlerOnChange} />
        <label>Email:</label>
        <input type='email' name='email' placeholder='Enter email address' onChange={handlerOnChange} />
        <label>Age:</label>
        <input type='number' name='age' placeholder='Enter age' onChange={handlerOnChange} />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default SimpleForm