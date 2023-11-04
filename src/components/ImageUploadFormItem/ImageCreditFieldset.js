import { Form, Input, Space } from 'antd';
import './styles.css';

function ImageCreditFieldset({ disabled = false }) {
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
						<Input placeholder='Author name' disabled={disabled} />
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
						<Input placeholder='URL to the author' disabled={disabled} />
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
						<Input placeholder='Source name' disabled={disabled} />
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
						<Input placeholder='URL of image source' disabled={disabled} />
					</Form.Item>
				</Space.Compact>
			</Form.Item>
		</>
	)
}

export default ImageCreditFieldset;