import { Button, Form, Space } from 'antd';
import Title from 'antd/es/typography/Title';

import ImageCreditFieldset from '../ImageUploadFormItem/ImageCreditFieldset';

function ImageCreditForm(props) {
	const {
		initialValues,
		handleSubmit,
		handleReset,
		loading,
		disabled,
		form,
		errors
	} = props;

	return (
		<Form
			layout='vertical'
			form={form}
			name='validateOnly'
			onFinish={handleSubmit}
		>
			<Title level={3}>
				Image Credit
			</Title>
			<ImageCreditFieldset disabled={disabled} />
			<Form.Item>
				<Space>
					<Button
						type='dashed'
						onClick={handleReset}
					>
						Reset
					</Button>
					<Button
						type='primary'
						htmlType='submit'
						loading={loading}
						disabled={disabled}
					>
						{
							typeof initialValues === 'undefined' ? 'Add to database' : 'Update'
						}
					</Button>
				</Space>
				<Form.ErrorList errors={errors} />
			</Form.Item>
		</Form>
	)
}

export default ImageCreditForm;