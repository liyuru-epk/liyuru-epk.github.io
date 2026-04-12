document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.full-screen');
    let currentSection = 0;
    let isScrolling = false;
    const scrollThreshold = 50; // 滚动阈值，调整这个值可以改变触发翻页的灵敏度

    // 只有当有.full-screen section时才执行翻页相关代码
    if (sections.length > 0) {
        function scrollToSection(index) {
            if (index >= 0 && index < sections.length) {
                isScrolling = true;
                sections[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center' // 改为center，使页面滚动到元素中心
                });
                currentSection = index;
                
                // 滚动结束后重置标志
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }

        function handleWheel(event) {
            if (isScrolling) {
                event.preventDefault();
                return;
            }
            
            const deltaY = event.deltaY;
            
            if (Math.abs(deltaY) > scrollThreshold) {
                event.preventDefault();
                
                if (deltaY > 0) {
                    // 向下滚动
                    if (currentSection < sections.length - 1) {
                        scrollToSection(currentSection + 1);
                    }
                } else {
                    // 向上滚动
                    if (currentSection > 0) {
                        scrollToSection(currentSection - 1);
                    }
                }
            }
        }

        function handleTouchStart(e) {
            touchStartY = e.touches[0].clientY;
        }

        function handleTouchMove(e) {
            if (isScrolling) {
                e.preventDefault();
                return;
            }
            
            const touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            
            if (Math.abs(deltaY) > scrollThreshold) {
                e.preventDefault();
                
                if (deltaY > 0) {
                    // 向下滑动
                    if (currentSection < sections.length - 1) {
                        scrollToSection(currentSection + 1);
                    }
                } else {
                    // 向上滑动
                    if (currentSection > 0) {
                        scrollToSection(currentSection - 1);
                    }
                }
            }
        }

        // 监听鼠标滚轮事件
        window.addEventListener('wheel', handleWheel);
        
        // 监听触摸事件（移动端）
        let touchStartY = 0;
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);

        // 监听导航链接点击
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                const targetIndex = Array.from(sections).indexOf(targetSection);
                if (targetIndex !== -1) {
                    scrollToSection(targetIndex);
                } else {
                    // 如果是外部链接，直接跳转
                    window.location.href = targetId;
                }
            });
        });

        // 监听滚动事件，更新当前section
        window.addEventListener('scroll', function() {
            if (isScrolling) return;
            
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = index;
                }
            });
        });
    }

    // 评论功能
    const commentForm = document.getElementById('commentForm');
    const commentsContainer = document.getElementById('commentsContainer');
    
    if (commentForm && commentsContainer) {
        // 加载评论
        loadComments();
        
        // 提交评论
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                const comment = {
                    id: Date.now(),
                    name: name,
                    email: email,
                    message: message,
                    date: new Date().toISOString()
                };
                
                // 保存评论
                saveComment(comment);
                
                // 清空表单
                commentForm.reset();
                
                // 重新加载评论
                loadComments();
            }
        });
    }
    
    // 自动计算并更新分类文章数量
    function updateCategoryCounts() {
        // 定义每个分类对应的文章链接
        const categories = {
            'tech': ['post1.html', 'post2.html'],
            'life': ['post3.html'],
            'travel': []
        };
        
        // 更新首页分类显示
        for (const [category, posts] of Object.entries(categories)) {
            const categoryItem = document.querySelector(`.category-item:nth-child(${Object.keys(categories).indexOf(category) + 1}) p`);
            if (categoryItem) {
                categoryItem.textContent = `${posts.length}篇文章`;
            }
        }
    }
    
    // 页面加载时更新分类文章数量
    updateCategoryCounts();
    
    function saveComment(comment) {
        let comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push(comment);
        localStorage.setItem('comments', JSON.stringify(comments));
    }
    
    function loadComments() {
        let comments = JSON.parse(localStorage.getItem('comments')) || [];
        commentsContainer.innerHTML = '';
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item glass-effect';
            commentElement.style.padding = '1.5rem';
            commentElement.style.marginBottom = '1rem';
            
            const date = new Date(comment.date).toLocaleString();
            
            commentElement.innerHTML = `
                <h4>${comment.name}</h4>
                <p class="comment-date">${date}</p>
                <p>${comment.message}</p>
            `;
            
            commentsContainer.appendChild(commentElement);
        });
    }
});