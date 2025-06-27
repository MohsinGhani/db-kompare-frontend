import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const { Title } = Typography;

export const CheckoutForm = ({user}) => {
  const [form] = Form.useForm();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const backendUrl = '/api/create-payment-intent';

  const onFinish = async ({ email, certificateId }) => {
    if (!stripe || !elements) return;
    setErrorMessage('');
    setLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card details not entered');

      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: email, certificateId }),
      });
      const data = await res.json();

      if (data.free) {
        // free issuance
        setLoading(false);
        // TODO: show certificate success UI
      } else {
        const { clientSecret } = data;
        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/success`,
          },
        });
        if (error) throw error;
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(user){
        form.setFieldsValue({
            email: user.email || '',    
        });
    }
  },[user])

  return (
    <div className="w-full lg:max-w-[30%] mt-10 p-8 bg-white rounded-xl border shadow-md">
      <Title level={3} className="text-center mb-6">PAYMENT</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
       
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Invalid email' }
          ]}
          
        >
          <Input
            placeholder="johndoe@example.com"
            disabled
            className="rounded-md border-gray-300 py-3 focus:border-blue-500"
          />
        </Form.Item>

        {/* <Form.Item
          name="certificateId"
          label="Certificate ID"
          rules={[{ required: true, message: 'Please enter certificate ID' }]}
        >
          <Input
            placeholder="Certificate ID"
            className="rounded-md border-gray-300 focus:border-blue-500"
          />
        </Form.Item> */}

        <Form.Item label="Card Details" required>
          <div className="border border-gray-300 p-2 py-4 rounded-md">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        </Form.Item>

        {errorMessage && (
          <Form.Item>
            <Typography.Text type="danger">{errorMessage}</Typography.Text>
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!stripe || loading}
            block
            className="w-full rounded-md"
          >
            {loading ? 'Processing...' : 'Pay €10'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
