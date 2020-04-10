import * as tf from "@tensorflow/tfjs";

export function ReadCSV(url, delimiter){
    const data = tf.data.csv(url, {
        hasHeader: true,
        delimiter: delimiter
    });
    return data;
}