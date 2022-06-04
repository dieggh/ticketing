import { useEffect, useState } from "react";
import Router from "next/router";
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSuccess: (payment) => Router.push('/orders')
    })
    useEffect(() => {
        const findTimeLeft = () => {
            const timeLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(timeLeft / 1000));
        }
        findTimeLeft();
        const intervalId = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(intervalId);
        }
    }, [order])
    if (timeLeft < 0) {
        return <div>Order Expired</div>;
    }
    return <div>
        Time left to pay {timeLeft} seconds
        <StripeCheckout
            token={({ id }) => doRequest({ token: id })}
            stripeKey='pk_test_51HGCWwCm1gD1SlZxYA0baoh9iUPyiqjbc2x02laWKCqvJE2zNjWmQ0u1ll8aNBVps93xQVqx8fiaZ6xNaYqPWkWV00jisCu3XS'
            amount={order.ticket.price * 100}
            email={currentUser.email}
            currency='MXN'
        />
        {errors}
        </div>;
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
}

export default OrderShow;