import { Button, Form, Input, Space } from 'antd';
import Title from 'antd/es/typography/Title';

function ImageCreditFieldset(props) {
	const {
		initialValues,
		handleSubmit,
		loading,
		form
	} = props;
	return (
		<Form
			layout='vertical'
			form={form}
			onFinish={handleSubmit}
			initialValues={{
				authorName: initialValues?.authorName || '',
				authorURL: initialValues?.authorURL || '',
				sourceName: initialValues?.sourceName || '',
				sourceURL: initialValues?.sourceURL || '',
			}}
		>
			<Title level={3}>
				Image Credit
			</Title>
			<Form.Item label='Author/Owner'>
				<Space.Compact>
					<Form.Item
						name='authorName'
						noStyle
						rules={[{
							type: String,
							message: 'Must be a valid string'
						}]}
					>
						<Input style={{ width: '50%' }} placeholder='Author name' />
					</Form.Item>
					<Form.Item
						name='authorURL'
						noStyle
						rules={[{
							type: String,
							pattern: /^(https?|ftp|smtp):\/\/[^."]+$/,
							message: 'Must be a valid URL'
						}]}
					>
						<Input style={{ width: '50%' }} placeholder='URL to the author' />
					</Form.Item>
				</Space.Compact>
			</Form.Item >
			<Form.Item label='Image Source'>
				<Space.Compact>
					<Form.Item
						name='sourceName'
						noStyle
						rules={[{
							type: String,
							message: 'Must be a valid string'
						}]}
					>
						<Input style={{ width: '50%' }} placeholder='Source name' />
					</Form.Item>
					<Form.Item
						name='sourceURL'
						noStyle
						rules={[{
							type: String,
							pattern: /^(https?|ftp|smtp):\/\/[^."]+$/,
							message: 'Must be a valid URL'
						}]}
					>
						<Input style={{ width: '50%' }} placeholder='URL of image source' />
					</Form.Item>
				</Space.Compact>
			</Form.Item>
			<Form.Item>
				<Button
					type='primary'
					htmlType='submit'
					loading={loading}
				>
					{
						typeof initialValues === 'undefined' ? 'Add to database' : 'Update'
					}
				</Button>
			</Form.Item>
		</Form>
	)
}

export default ImageCreditFieldset;