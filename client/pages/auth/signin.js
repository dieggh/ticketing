import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () =>  Router.push('/')
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
                        
            doRequest();

        } catch (error) {
            console.log(error)
        }



    }

    return <form onSubmit={onSubmit}>
        <h1>Sign IN</h1>
        <div className="form-group">
            <label>Email Address</label>
            <input value={email} className="form-control" onChange={e => setEmail(e.target.value)} type="text" />
        </div>
        <div className="form-group">
            <label>Password</label>
            <input value={password} className="form-control" type="text" onChange={e => setPassword(e.target.value)} />
        </div>
        
            {errors}
        
        <div>
            <button type="submit" className="btn btn-sm btn-info">Sign IN</button>
        </div>
        
    </form>
}