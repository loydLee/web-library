# git 使用笔记

## 合并分支

```git
git merge --no-ff ...：不使用fast-forward方式合并，保留分支的commit历史
```

## 删除分支

```git
删除远程分支：git push origin :远程分支名
删除本地分支：git branch -d 本地分支名
```

## 清除远程分支

```git
git远程删除分支后，本地git branch -a 依然能看到的解决办法：git remote prune origin
```

## 更改 git 仓库

```git
git remote set-url origin 新地址
```

## 从别人 github 地址上通过 git clone 下载下来, push 到自己仓库

```git
git rm -r --cached .
git config core.autocrlf false
git add .
```

## 回滚代码

```git
处理回滚的开发
git reset --hard commit {commitId}
git push --force origin {branchName}

其他小伙伴本地
git reset --hard origin {branchName}
git pull origin {branchName}
```

## 子模块 submoudle

```git
首次克隆仓库及其模块
git clone --recursive 仓库地址

仓库首次拉取模块
git submodule update --init --recursive

更新子模块
1.8.2
git submodule update --recursive --remote

1.7.3
git submodule update --recursive

或者
git pull --recurse-submodules

git clone –recursive 递归的方式克隆整个项目
git submodule add 添加子模块
git submodule init 初始化子模块
git submodule update 更新子模块
git submodule foreach git pull 拉取所有子模块
```
