import React from 'react';
import './App.css';

// < Интерфейсы ===================================================================================>
interface Param {
	id: number;
	name: string;
}
interface ParamValue {
	paramId: number;
	value: string | any[] | number;
	type: 'string' | 'number' | 'select';
}
interface Model {
	paramValues: ParamValue[];
	colors?: any[];
}
interface Props {
	params: Param[];
	model: Model;
	onModelValueChanged: (id: number, newValue: string) => void;
}

interface AddParamForm {
	name: string;
	value: string | any[] | number; //
	type: 'string' | 'number' | 'select';
}
// < Тип для Функции ===============================================================================>

type PanelProps = {
	onNewParam: (newParam: AddParamForm) => void;
};
// < Начальное значение ============================================================================>

const initialForm: AddParamForm = {
	name: '',
	value: '',
	type: 'string',
};
// < Создание Id ===================================================================================>

let currentId = 0;
function getNewId() {
	currentId++;
	return currentId;
}
// < Компонент для создания параметров =============================================================>

function Panel(props: PanelProps) {
	const [form, setForm] = React.useState<AddParamForm>(initialForm);

	const { onNewParam } = props;

	const onChangeVal = (
		event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
		key: 'name' | 'value' | 'type',
	) => {
		const { value } = event.target;
		setForm({ ...form, [key]: value });
	};

	const onClickBtn = () => {
		onNewParam(form);
		setForm(initialForm);
	};
	return (
		<>
			<form className='form '>
				<div>
					<p>Title</p>
					<input
						className='input_name'
						name='name'
						type='text'
						value={form.name}
						onChange={(event) => onChangeVal(event, 'name')}
					/>
				</div>
				<div className='select_block'>
					<label htmlFor='type'>Choose type:</label>
					<select
						className='select'
						value={form.type}
						name='type'
						id='type'
						onChange={(event) => onChangeVal(event, 'type')}
					>
						<option value={'string'}> String </option>
						<option value={'number'}> Number </option>
						<option value={'select'}> Select </option>
					</select>
				</div>
				<div>
					<p>Descrition</p>
					<input
						className='input_text'
						name='value'
						value={form.value}
						onChange={(event) => onChangeVal(event, 'value')}
					/>
				</div>
			</form>
			<button className='btn' onClick={() => onClickBtn()}>
				Add me!
			</button>
		</>
	);
}
// < Компонент для рендера и редактирования параметров =============================================>

function ParamEditor(props: Props) {
	const { params, model, onModelValueChanged } = props;

	const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
		const { value } = event.target;
		onModelValueChanged(id, value);
	};
	const getModel = () => model;

	return (
		<div className='container_paramEditor'>
			<div className='render'>
				<>
					{params.map((item) => (
						<div className='elem'>
							<div className='titles' key={item.id}>
								{item.name}
							</div>
							{getModel()
								.paramValues.filter((obj) => obj.paramId === item.id)
								.map((obj) =>
									obj.type === 'string' ? (
										<input
											className='inputes'
											key={obj.paramId}
											value={obj.value}
											onChange={(event) => onChangeValue(event, obj.paramId)}
										/>
									) : (
										<div className='typeNot' key={obj.paramId}>
											Type is not string
										</div>
									),
								)}
						</div>
					))}
				</>
			</div>
		</div>
	);
}
// < Основной Компонент APP ========================================================================>

function App() {
	const [params, setParams] = React.useState<Param[]>([]);
	const [paramValues, setParamValues] = React.useState<ParamValue[]>([]);

	const onNewParam = (form: AddParamForm) => {
		const id = getNewId();
		const { name, type, value } = form;

		const param: Param = {
			name: name,
			id: id,
		};
		const paramVal: ParamValue = {
			paramId: id,
			type: type,
			value: value,
		};

		if (name && value) {
			setParams([...params, param]);
			setParamValues([...paramValues, paramVal]);
		} else {
			alert('Пожалуйста заполните все Inputs!');
		}
	};

	const onModelValueChanged = (id: number, newValue: string) => {
		const newModels = paramValues.map((val: ParamValue) => {
			if (val.paramId === id) {
				return { ...val, value: newValue };
			}

			return val;
		});

		setParamValues(newModels);
	};

	const model = {
		paramValues: paramValues,
	};

	return (
		<div className='App'>
			<div className='container'>
				<Panel onNewParam={onNewParam} />

				<ParamEditor
					onModelValueChanged={onModelValueChanged}
					model={model}
					params={params}
				/>
			</div>
		</div>
	);
}

export default App;
