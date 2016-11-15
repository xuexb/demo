# vim配置文件

```
" ~/.vimrc

" 颜色设置:hi 命令 ctermfg=文字颜色 ctermbg=背景色 cterm=彩色终端 ,underline:表示下滑线, NONE表示无
" :highlight Comment cterm=underline ctermfg=red ctermbg=blue   gui，可以使用选项gui=attribute，来定义图形窗口下语法元素的显示属性。选项guifg和guibg，用来定义了前景色和背景色。推荐使 用的颜色包括：black, brown, grey, blue, green, cyan, magenta, yellow, white。

" install Vundle bundles
if filereadable(expand("~/.vimrc.bundles"))
    source ~/.vimrc.bundles
endif

" 开启语法高亮
syntax on

set list

" 显示Tab符，使用一高亮竖线代替
set listchars=tab:»·,trail:·

" history存储容量
set history=2000

" 文件修改之后自动载入
set autoread

" 启动的时候不显示那个援助索马里儿童的提示
set shortmess=atI

" 取消备份
set nobackup

" 关闭交换文件
set noswapfile

" 突出显示当前列
" set cursorcolumn

" 列颜色
" hi cursorcolumn cterm=reverse

set colorcolumn=120

" 突出显示当前行
set cursorline

" 行颜色
hi cursorline cterm=underline

" 设置 退出vim后，内容显示在终端屏幕, 可以用于查看和复制
" 好处：误删什么的，如果以前屏幕打开，可以找回
set t_ti= t_te=

" 显示当前的行号列号：
set ruler

" 在状态栏显示正在输入的命令
set showcmd

" 左下角显示当前vim模式
set showmode

" 在上下移动光标时，光标的上方或下方至少会保留显示的行数
set scrolloff=10

"显示行号
set number

" 取消换行
set nowrap
" set textwidth=120

" 括号配对情况,跳转并高亮一下匹配的括号
set showmatch

" How many tenths of a second to blink when matching brackets
set matchtime=2

set nofoldenable " 关闭折叠
set foldmethod=manual " 设置语法折叠
set foldcolumn=0 " 设置折叠区域的宽度
setlocal foldlevel=1 " 设置折叠层数为

set smartindent   " 开启新行时使用智能自动缩进
set autoindent    " 打开自动缩进

set shiftwidth=4 " 设定 << 和 >> 命令移动时的宽度为 4
set softtabstop=4 " 使得按退格键时可以一次删掉 4 个空格
set tabstop=4 " 设定 tab 长度为 4
set autochdir " 自动切换当前目录为当前文件所在的目录

set hidden " 允许在有未保存的修改时切换缓冲区，此时的修改由 vim 负责保存

" 设置新文件的编码为 UTF-8
set encoding=utf-8
" 自动判断编码时，依次尝试以下编码：
set fileencodings=ucs-bom,utf-8,cp936,gb18030,big5,euc-jp,euc-kr,latin1
set helplang=cn
"set langmenu=zh_CN.UTF-8
"set enc=2byte-gb18030
" 下面这句只影响普通模式 (非图形界面) 下的 Vim。
set termencoding=utf-8

" Use Unix as the standard file type
set ffs=unix,dos,mac

"==========================================
" others 其它设置
"==========================================
"autocmd! bufwritepost _vimrc source % " vimrc文件修改之后自动加载。 windows。
autocmd! bufwritepost .vimrc source % " vimrc文件修改之后自动加载。 linux。

" 自动补全配置
"让Vim的补全菜单行为与一般IDE一致(参考VimTip1228)
set completeopt=longest,menu


" F1 - F6 设置
" F1 废弃这个键,防止调出系统帮助
" F2 行号开关，用于鼠标复制代码用
" F3 显示可打印字符开关
" F4 换行开关
" F5 粘贴模式paste_mode开关,用于有格式的代码粘贴
" F6 语法开关，关闭语法可以加快大文件的展示

" I can type :help on my own, thanks.  Protect your fat fingers from the evils of <F1>
"noremap <F1> <Esc>"

""为方便复制，用<F2>开启/关闭行号显示:
function! HideNumber()
  if(&relativenumber == &number)
    set relativenumber! number!
  elseif(&number)
    set number!
  else
    set relativenumber!
  endif
  set number?
endfunc
nnoremap <F2> :call HideNumber()<CR>
nnoremap <F3> :set list! list?<CR>
nnoremap <F4> :set wrap! wrap?<CR>

set pastetoggle=<F5>

" disbale paste mode when leaving insert mode
au InsertLeave * set nopaste

nnoremap <F6> :exec exists('syntax_on') ? 'syn off' : 'syn on'<CR>

set ignorecase smartcase " 搜索时忽略大小写，但在有一个或以上大写字母时仍保持对大小写敏感
set nowrapscan " 禁止在搜索到文件两端时重新搜索
set incsearch " 输入搜索内容时就显示搜索结果
set hlsearch " 搜索时高亮显示被找到的文本

set magic " 设置魔术

set cmdheight=1 " 设定命令行的行数为 1
set laststatus=2 " 显示状态栏 (默认值为 1, 无法显示状态栏)
set statusline=\ %<%F[%1*%M%*%n%R%H]%=\ %y\ %0(%{&fileformat}\ %{&encoding}\ %c:%l/%L%)\ " 设置在状态行显示的信息
```

---

```
" ~/.vimrc.bundles

set nocompatible              " be iMproved, required
filetype off                  " required

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'VundleVim/Vundle.vim'

" 目录树
Bundle 'scrooloose/nerdtree'
" 按下 F7 调出/隐藏 NERDTree
map <F7> :NERDTreeToggle<CR>
" autocmd VimEnter * NERDTree 


" 快速注释
Bundle 'scrooloose/nerdcommenter'


"#####  emmet for vim http://www.zfanw.com/blog/zencoding-vim-tutorial-chinese.html
Bundle "mattn/emmet-vim"
autocmd FileType html,javascript,css EmmetInstall
" 默认为 C-y ,
let g:user_emmet_expandabbr_key = '<Tab>'


Plugin 'godlygeek/tabular'
Plugin 'plasticboy/vim-markdown'

call vundle#end()            " required
filetype plugin indent on    " required
```