
export function Normalize(tensor) {
    const max = tensor.max();
    const min = tensor.min();
    const normalized = NormalizeVal(max, min, tensor);
    return { max, min, normalized };
}

export function NormalizeVal(max, min, value){
    const normalized = value.sub(min).div(max.sub(min));
    return normalized;
}

export function InputDimSize(tensor) {
    return tensor.shape[1];
}
