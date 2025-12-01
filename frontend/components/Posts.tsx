import React from 'react';
import { PageHeader } from './PageHeader';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Calendar, User, X, Send, Upload, FileImage, FileText, File, Paperclip, Download } from 'lucide-react';
import { useState } from 'react';



export function Posts() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showComments, setShowComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      authorRole: 'Giáo viên IELTS',
      avatar: '👨‍🏫',
      date: 'Hôm nay lúc 10:30',
      content: 'Chúc mừng các học viên lớp IELTS Foundation A1 đã hoàn thành xuất sắc bài kiểm tra giữa khóa! Kết quả trung bình 7.5 điểm, đặc biệt có 5 bạn đạt 8.0+. Keep up the great work! 🎉',
      image: null,
      likes: 24,
      comments: 8,
      shares: 3,
      color: '#FF8C42',
      commentsList: [
        {
          id: 1,
          author: 'Nguyễn Thị Hoa',
          avatar: '👩‍🎓',
          content: 'Cảm ơn thầy rất nhiều! Lớp em rất vui khi nhận được kết quả này ạ 🎉',
          date: '30 phút trước'
        },
        {
          id: 2,
          author: 'Trần Văn Nam',
          avatar: '👨‍🎓',
          content: 'Em sẽ cố gắng hơn nữa để đạt 8.0+ trong kỳ thi chính thức ạ!',
          date: '25 phút trước'
        },
        {
          id: 3,
          author: 'Lê Thị Mai',
          avatar: '👩‍🎓',
          content: 'Thầy có thể chia sẻ thêm về cách cải thiện Writing không ạ?',
          date: '15 phút trước'
        }
      ]
    },
    {
      id: 2,
      author: 'Trần Thị B',
      authorRole: 'Giáo viên TOEIC',
      avatar: '👩‍🏫',
      date: 'Hôm qua lúc 15:20',
      content: 'Thông báo: Workshop \"TOEIC Listening Tips & Tricks\" sẽ được tổ chức vào Chủ nhật 21/12, 9:00-11:00 tại phòng đa năng. Tất cả học viên đều được tham gia miễn phí. Đăng ký tại phòng hành chính nhé! 📚',
      image: null,
      likes: 42,
      comments: 15,
      shares: 12,
      color: '#4ECDC4',
      commentsList: [
        {
          id: 1,
          author: 'Phạm Minh Tuấn',
          avatar: '👨‍🎓',
          content: 'Em đăng ký tham gia ạ! Workshop này rất hữu ích.',
          date: '5 giờ trước'
        },
        {
          id: 2,
          author: 'Vũ Thu Hà',
          avatar: '👩‍🎓',
          content: 'Cô có thể share tài liệu trước không ạ để em chuẩn bị?',
          date: '3 giờ trước'
        }
      ]
    },
    {
      id: 3,
      author: 'Lê Văn C',
      authorRole: 'Giáo viên Kids',
      avatar: '👨‍🏫',
      date: '2 ngày trước',
      content: 'Hôm nay các bé lớp Communication Kids đã có buổi học ngoài trời thú vị với chủ đề "At the Park". Các con rất hào hứng và tự tin giao tiếp bằng tiếng Anh. Cảm ơn phụ huynh đã ủng hộ! 🌳👧👦',
      image: null,
      likes: 56,
      comments: 23,
      shares: 8,
      color: '#95E1D3'
    },
    {
      id: 4,
      author: 'Phạm Thị D',
      authorRole: 'Giáo viên Business',
      avatar: '👩‍🏫',
      date: '3 ngày trước',
      content: 'Chia sẻ tài liệu học Business English cho các bạn đang chuẩn bị phỏng vấn việc làm. File PDF đã được upload vào Google Drive của lớp. Chúc các bạn thành công! 💼✨',
      image: null,
      likes: 38,
      comments: 12,
      shares: 20,
      color: '#FFB677'
    }
  ]);

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleShowComments = (postId: number) => {
    if (showComments === postId) {
      setShowComments(null);
    } else {
      setShowComments(postId);
    }
  };

  const handleAddComment = (postId: number) => {
    const newComment: Comment = {
      id: Date.now(),
      author: 'Bạn',
      avatar: '👨‍💻',
      content: commentText,
      date: 'Vừa xong'
    };
    setPosts(prev => {
      return prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            commentsList: [...(post.commentsList || []), newComment],
            comments: post.comments + 1
          };
        }
        return post;
      });
    });
    setCommentText('');
  };

  const handleCreatePost = () => {
    const newPost: Post = {
      id: Date.now(),
      author: 'Bạn',
      authorRole: 'Học viên',
      avatar: '👨‍💻',
      date: 'Vừa xong',
      content: newPostContent,
      image: newPostImage,
      attachments: attachments,
      likes: 0,
      comments: 0,
      shares: 0,
      color: '#FF8C42'
    };
    setPosts(prev => [...prev, newPost]);
    setShowCreateModal(false);
    setNewPostContent('');
    setNewPostImage(null);
    setImageFile(null);
    setAttachments([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        url: URL.createObjectURL(file)
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return { icon: FileText, color: '#FF3B30' };
    if (type.includes('word') || type.includes('document')) return { icon: FileText, color: '#2B5CE7' };
    if (type.includes('excel') || type.includes('spreadsheet')) return { icon: FileText, color: '#1D6F42' };
    if (type.includes('powerpoint') || type.includes('presentation')) return { icon: FileText, color: '#D14423' };
    return { icon: File, color: '#8E8E93' };
  };

  const removeAttachment = (id: number) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  return (
    <div>
      <PageHeader 
        title="Bài đăng" 
        onAdd={() => setShowCreateModal(true)}
        addLabel="Tạo bài đăng"
      />
      
      <div className="px-6 pb-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div 
            className="bg-white rounded-3xl p-6"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <div className="text-3xl font-semibold text-foreground mb-1">{posts.length}</div>
            <div className="text-muted-foreground">Tổng bài đăng</div>
          </div>
          <div 
            className="bg-white rounded-3xl p-6"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <div className="text-3xl font-semibold text-foreground mb-1">
              {posts.reduce((sum, p) => sum + p.likes, 0)}
            </div>
            <div className="text-muted-foreground">Lượt thích</div>
          </div>
          <div 
            className="bg-white rounded-3xl p-6"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <div className="text-3xl font-semibold text-foreground mb-1">
              {posts.reduce((sum, p) => sum + p.comments, 0)}
            </div>
            <div className="text-muted-foreground">Bình luận</div>
          </div>
          <div 
            className="bg-white rounded-3xl p-6"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <div className="text-3xl font-semibold text-foreground mb-1">
              {posts.reduce((sum, p) => sum + p.shares, 0)}
            </div>
            <div className="text-muted-foreground">Chia sẻ</div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="bg-white rounded-3xl p-6 transition-all hover:shadow-lg"
              style={{ boxShadow: 'var(--shadow-soft)' }}
            >
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${post.color} 0%, ${post.color}80 100%)` 
                  }}
                >
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{post.author}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{post.authorRole}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-foreground leading-relaxed">{post.content}</p>
              </div>

              {/* Image */}
              {post.image && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-border">
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
              )}

              {/* Attachments */}
              {post.attachments && post.attachments.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-3">📎 Tệp đính kèm ({post.attachments.length})</p>
                  <div className="space-y-2">
                    {post.attachments.map(att => {
                      const { icon: Icon, color } = getFileIcon(att.type);
                      return (
                        <div 
                          key={att.id} 
                          className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors group"
                        >
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${color}15` }}
                          >
                            <Icon className="w-6 h-6" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">{att.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Paperclip className="w-3.5 h-3.5" />
                              {att.size}
                            </p>
                          </div>
                          <a 
                            href={att.url} 
                            download={att.name}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span className="text-sm font-medium">Tải về</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center gap-6 pt-4 border-t border-border">
                <button 
                  className={`flex items-center gap-2 transition-all ${
                    likedPosts.has(post.id) 
                      ? 'text-[#FF3B30]' 
                      : 'text-muted-foreground hover:text-[#FF3B30]'
                  }`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart 
                    className={`w-5 h-5 transition-all ${
                      likedPosts.has(post.id) ? 'fill-[#FF3B30]' : ''
                    }`} 
                  />
                  <span className="font-medium">{likedPosts.has(post.id) ? post.likes + 1 : post.likes}</span>
                </button>
                <button 
                  className="flex items-center gap-2 text-muted-foreground hover:text-[#4ECDC4] transition-colors"
                  onClick={() => handleShowComments(post.id)}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-[#FF8C42] transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">{post.shares}</span>
                </button>
              </div>

              {/* Comments Section */}
              {showComments === post.id && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-4">Bình luận ({post.comments})</h4>
                  
                  {/* Comments List */}
                  {post.commentsList && post.commentsList.length > 0 ? (
                    <div className="space-y-4 mb-4">
                      {post.commentsList.map(comment => (
                        <div 
                          key={comment.id} 
                          className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/50"
                        >
                          <div 
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ 
                              background: `linear-gradient(135deg, ${post.color} 0%, ${post.color}80 100%)` 
                            }}
                          >
                            {comment.avatar}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{comment.author}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{comment.date}</span>
                              </div>
                            </div>
                            <p className="text-foreground leading-relaxed mt-1">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Chưa có bình luận nào.</div>
                  )}

                  {/* Add Comment */}
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${post.color} 0%, ${post.color}80 100%)` 
                      }}
                    >
                      👤
                    </div>
                    <input 
                      type="text" 
                      className="flex-1 px-4 py-2 border border-border rounded-3xl focus:outline-none focus:border-primary"
                      placeholder="Viết bình luận..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button 
                      className="px-4 py-2 bg-primary text-white rounded-3xl"
                      onClick={() => handleAddComment(post.id)}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ 
                    background: `linear-gradient(135deg, #FF8C42 0%, #FF8C4280 100%)` 
                  }}
                >
                  📝
                </div>
                <h3 className="text-xl font-semibold text-foreground">Tạo bài đăng mới</h3>
              </div>
              <button 
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewPostContent('');
                  setNewPostImage(null);
                  setImageFile(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ 
                  background: `linear-gradient(135deg, #FF8C42 0%, #FF8C4280 100%)` 
                }}
              >
                👨‍💻
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Bạn</h4>
                <p className="text-sm text-muted-foreground">Đang tạo bài đăng</p>
              </div>
            </div>

            {/* Content Input */}
            <div className="mb-6">
              <textarea 
                className="w-full px-5 py-4 border border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                placeholder="Bạn đang nghĩ gì?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={6}
              />
            </div>

            {/* Image Preview */}
            {newPostImage && (
              <div className="mb-6 relative">
                <div className="rounded-2xl overflow-hidden border border-border">
                  <img 
                    src={newPostImage} 
                    alt="Preview" 
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <button 
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  onClick={() => {
                    setNewPostImage(null);
                    setImageFile(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">Tệp đính kèm ({attachments.length})</p>
                <div className="space-y-2">
                  {attachments.map(att => {
                    const { icon: Icon, color } = getFileIcon(att.type);
                    return (
                      <div 
                        key={att.id} 
                        className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border"
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{att.name}</p>
                          <p className="text-xs text-muted-foreground">{att.size}</p>
                        </div>
                        <button 
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                          onClick={() => removeAttachment(att.id)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Attachment Options */}
            <div className="mb-6 p-4 bg-secondary/30 rounded-2xl">
              <p className="text-sm font-medium text-foreground mb-3">Thêm vào bài đăng</p>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                  <FileImage className="w-5 h-5 text-[#FF8C42]\" />
                  <span className="text-sm font-medium text-foreground">Hình ảnh</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                  <Paperclip className="w-5 h-5 text-[#4ECDC4]\" />
                  <span className="text-sm font-medium text-foreground">Đính kèm tệp</span>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
                {imageFile && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#FF8C42]/10 rounded-2xl border border-[#FF8C42]/20">
                    <FileImage className="w-4 h-4 text-[#FF8C42]\" />
                    <span className="text-sm text-[#FF8C42] truncate max-w-[200px]\">
                      {imageFile.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button 
                className="px-6 py-2.5 bg-secondary/50 text-foreground rounded-2xl hover:bg-secondary transition-colors"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewPostContent('');
                  setNewPostImage(null);
                  setImageFile(null);
                }}
              >
                Hủy
              </button>
              <button 
                className="px-6 py-2.5 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
              >
                Đăng bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}