import { Form, Input, Space } from 'antd';
import './styles.css';

function ImageCreditFieldset() {
	return (
		<>
			<Form.Item label='Author/Owner'>
				<Space.Compact className='image-credit-inputs'>
					<Form.Item
						name='authorName'
						noStyle
						rules={[{
							type: String,
							message: 'Must be a valid string'
						}]}
					>
						<Input placeholder='Author name' />
					</Form.Item>
					<Form.Item
						name='authorURL'
						noStyle
						rules={[{
							type: String,
							pattern: /^(https?|ftp|smtp):\/\/[^.']+$/,
							message: 'Must be a valid URL'
						}]}
					>
						<Input placeholder='URL to the author' />
					</Form.Item>
				</Space.Compact>
			</Form.Item >
			<Form.Item label='Image Source'>
				<Space.Compact className='image-credit-inputs'>
					<Form.Item
						name='sourceName'
						noStyle
						rules={[{
							type: String,
							message: 'Must be a valid string'
						}]}
					>
						<Input placeholder='Source name' />
					</Form.Item>
					<Form.Item
						name='sourceURL'
						noStyle
						rules={[{
							type: String,
							pattern: /^(https?|ftp|smtp):\/\/[^.']+$/,
							message: 'Must be a valid URL'
						}]}
					>
						<Input placeholder='URL of image source' />
					</Form.Item>
				</Space.Compact>
			</Form.Item>
		</>
	)
}

export default ImageCreditFieldset;