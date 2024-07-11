import react from "react";
import { useState } from "react";

function Users (){
    const [results, setResults] = useState([{
        Name:"yousaf" ,Email:"triveni@gmial.com",Age:20
    }])
    return(
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-centre">
            <div className='w-50 bg-white rounded p-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                         {
                            Users.map((user) =>{
                                return<tr>
                                    <td>{user.Name}</td>
                                    <td>{user.Email}</td>
                                    <td>{user.Age}</td>
                                    <td><button>Edit</button><button>Delete</button></td>
                                </tr>
                            })
                         }
                    </tbody>
                </table>

            </div>
          
        </div>
    )
}

export default Users;