from rest_framework import serializers

from api.models import User, Post, LostStatus, Bookmark, Comment, PostUploads
from api import models

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields ='__all__'
        #fields = ('username', 'password', 'email', 'first_name', 'last_name', 'about')
        #read_only_fields = ('email',)


class PostUploadsSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostUploads
        fields = ('pk', 'post_id', 'image')


class PostSerializer(serializers.ModelSerializer):
    uploads = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('pk', 'name', 'user_id', 'info', 'is_search', 'registration_number', 'vin_code', 'brand', 'model',
                  'year', 'color', 'distinct_feature', 'vehicle_seen_place', 'vehicle_seen_date',
                  'created', 'closed', 'is_active', 'uploads')

    def get_uploads(self, obj):
        post_upload_query = models.PostUploads.objects.filter(post_id=obj.id)
        serializer = PostUploadsSerializer(post_upload_query, many=True)

        return serializer.data


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'


class BookmarkSerializer(serializers.ModelSerializer):
    post = serializers.SerializerMethodField()
    # user_post = serializers.BooleanField(default=False)

    class Meta:
        model = Bookmark
        fields = ('pk', 'user_id', 'post_id', 'post')

    def get_post(self, obj):
        post_query = models.Post.objects.filter(pk=obj.post_id.pk).first()
        serializer = PostSerializer(post_query)
        return serializer.data
    #
    # def get_user_post(self, obj):
    #


class LostStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = LostStatus
        fields = ('post_search_id', 'post_found_id', 'status')
