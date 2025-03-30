import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { addArticle, updateArticle } from '../store/slices/articleSlice';
import { RootState } from '../store/store';
import { Ionicons } from '@expo/vector-icons';

export default function CreateArticleScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        title: '',
        content: '',
        imageUrl: ''
    });

    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.currentUser);
    const articles = useSelector((state: RootState) => state.articles.articles);

    useEffect(() => {
        if (id) {
            const article = articles.find((a) => a._id === id);
            if (article) {
                setTitle(article.title);
                setContent(article.content);
                setImageUrl(article.imageUrl);
            }
        }
    }, [id, articles]);

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            title: '',
            content: '',
            imageUrl: ''
        };

        if (!title.trim()) {
            newErrors.title = 'Title is required';
            valid = false;
        } else if (title.length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
            valid = false;
        }

        if (!content.trim()) {
            newErrors.content = 'Content is required';
            valid = false;
        } else if (content.length < 50) {
            newErrors.content = 'Content should be at least 50 characters';
            valid = false;
        }

        if (!imageUrl.trim()) {
            newErrors.imageUrl = 'Image URL is required';
            valid = false;
        } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(imageUrl)) {
            newErrors.imageUrl = 'Please enter a valid image URL';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        if (!user) {
            Alert.alert('Authentication Required', 'Please login to create articles');
            return;
        }

        setIsSubmitting(true);

        const articleData = {
            title: title.trim(),
            content: content.trim(),
            imageUrl: imageUrl.trim(),
            authorId: user._id,
            authorName: user.name,
            authorAvatar: user.avatar,
            createdAt: new Date().toISOString(),
            likes: 0,
            dislikes: 0,
            comments: [],
        };

        try {
            if (id) {
                dispatch(updateArticle({ articleId: id as string, articleData }));
            } else {
                dispatch(addArticle(articleData));
            }
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to save article. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: id ? 'Edit Article' : 'Create Article',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ marginLeft: 15 }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Image Preview */}
                {imageUrl ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.imagePreview}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.clearImageButton}
                            onPress={() => setImageUrl('')}
                        >
                            <Ionicons name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : null}

                {/* Title Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Article Title</Text>
                    <TextInput
                        style={[styles.input, errors.title && styles.inputError]}
                        placeholder="Enter article title"
                        placeholderTextColor="#999"
                        value={title}
                        onChangeText={(text) => {
                            setTitle(text);
                            setErrors({...errors, title: ''});
                        }}
                        maxLength={100}
                    />
                    {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
                    <Text style={styles.charCount}>{title.length}/100</Text>
                </View>

                {/* Image URL Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Cover Image URL</Text>
                    <TextInput
                        style={[styles.input, errors.imageUrl && styles.inputError]}
                        placeholder="https://example.com/image.jpg"
                        placeholderTextColor="#999"
                        value={imageUrl}
                        onChangeText={(text) => {
                            setImageUrl(text);
                            setErrors({...errors, imageUrl: ''});
                        }}
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {errors.imageUrl ? <Text style={styles.errorText}>{errors.imageUrl}</Text> : null}
                </View>

                {/* Content Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Article Content</Text>
                    <TextInput
                        style={[styles.input, styles.contentInput, errors.content && styles.inputError]}
                        placeholder="Write your article content here..."
                        placeholderTextColor="#999"
                        value={content}
                        onChangeText={(text) => {
                            setContent(text);
                            setErrors({...errors, content: ''});
                        }}
                        multiline
                        textAlignVertical="top"
                    />
                    {errors.content ? <Text style={styles.errorText}>{errors.content}</Text> : null}
                    <Text style={styles.charCount}>{content.length} characters</Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        isSubmitting && styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? (
                            id ? 'Updating...' : 'Publishing...'
                        ) : (
                            id ? 'Update Article' : 'Publish Article'
                        )}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    imagePreviewContainer: {
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        height: 200,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    clearImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        color: '#333',
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF6F6',
    },
    contentInput: {
        height: 200,
        paddingTop: 15,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginTop: 5,
    },
    charCount: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonDisabled: {
        backgroundColor: '#A0C8FF',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});