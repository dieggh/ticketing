import useRequest from "../../hooks/use-request";
import { useForm } from "../../hooks/useForm";
import Router from 'next/router'

const NewTicket = () => {

    const { title, price, onChange } = useForm({
        title: 'hola',
        price: 0
    });
    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: (ticket) => Router.push('/')
    });

    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    }

    const onBlur = () => {
        const value = parseFloat(price);
        if(isNaN(value)) {
            return;
        }
        onChange(value.toFixed(2), 'price');
    };

    return (
        <div>
            <h1>Create a new Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input name='title'
                        value={title}
                        onChange={e => onChange(e.target.value, 'title')}
                        className="form-control">
                        </input>
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        name='price'
                        value={price}
                        onChange={e => onChange(e.target.value, 'price')}
                        className="form-control"
                        onBlur={onBlur}>
                        </input>
                </div>
                <div className="form-group mt-2">
                    <button className="btn btn-primary"> Submit </button>
                </div>
                <div className="form-group mt-1">
                    {errors}
                </div>
            </form>
        </div>
    )
}

export default NewTicket;