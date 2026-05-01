import base64
import io

import cv2
import numpy as np
import tensorflow as tf
from PIL import Image


def image_array_to_base64(image_array: np.ndarray) -> str:
    """
    Converts a NumPy RGB image array into a base64 PNG string.
    """
    image = Image.fromarray(image_array.astype("uint8"))
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")

    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return f"data:image/png;base64,{encoded}"


def normalize_heatmap(heatmap: np.ndarray) -> np.ndarray:
    """
    Normalizes a heatmap to the range [0, 1].
    """
    heatmap = np.maximum(heatmap, 0)

    max_value = np.max(heatmap)

    if max_value == 0:
        return heatmap

    return heatmap / max_value


def find_last_conv_layer_name(model) -> str:
    """
    Automatically finds the last Conv2D layer in the model.
    This is useful for Grad-CAM.
    """
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name

    raise ValueError("No Conv2D layer found in the model.")


def generate_gradcam(model, image_array: np.ndarray, original_rgb: np.ndarray) -> str:
    """
    Generates a Grad-CAM visualization and returns it as base64.
    """
    last_conv_layer_name = find_last_conv_layer_name(model)

    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[
            model.get_layer(last_conv_layer_name).output,
            model.output,
        ],
    )

    input_tensor = tf.convert_to_tensor(image_array)

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(input_tensor)
        loss = predictions[:, 0]

    grads = tape.gradient(loss, conv_outputs)

    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]

    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap).numpy()

    heatmap = normalize_heatmap(heatmap)

    heatmap = cv2.resize(
        heatmap,
        (original_rgb.shape[1], original_rgb.shape[0]),
    )

    heatmap_uint8 = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    heatmap_color = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)

    overlay = cv2.addWeighted(original_rgb, 0.6, heatmap_color, 0.4, 0)

    return image_array_to_base64(overlay)


def generate_saliency_map(model, image_array: np.ndarray, original_rgb: np.ndarray) -> str:
    """
    Generates a Saliency Map visualization and returns it as base64.
    """
    input_tensor = tf.convert_to_tensor(image_array)

    with tf.GradientTape() as tape:
        tape.watch(input_tensor)
        predictions = model(input_tensor)
        loss = predictions[:, 0]

    gradients = tape.gradient(loss, input_tensor)

    saliency = tf.reduce_max(tf.abs(gradients), axis=-1)[0].numpy()
    saliency = normalize_heatmap(saliency)

    saliency = cv2.resize(
        saliency,
        (original_rgb.shape[1], original_rgb.shape[0]),
    )

    saliency_uint8 = np.uint8(255 * saliency)
    saliency_color = cv2.applyColorMap(saliency_uint8, cv2.COLORMAP_HOT)
    saliency_color = cv2.cvtColor(saliency_color, cv2.COLOR_BGR2RGB)

    overlay = cv2.addWeighted(original_rgb, 0.6, saliency_color, 0.4, 0)

    return image_array_to_base64(overlay)