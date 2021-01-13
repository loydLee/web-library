# git 使用笔记

## 合并分支

```
git merge --no-ff ...：不使用fast-forward方式合并，保留分支的commit历史
```

## 删除分支

```
删除远程分支：git push origin :远程分支名
删除本地分支：git branch -d 本地分支名
```

## 清除远程分支

```
git远程删除分支后，本地git branch -a 依然能看到的解决办法：git remote prune origin
```

## 更改 git 仓库

```
git remote set-url origin 新地址
```

## 从别人 github 地址上通过 git clone 下载下来, push 到自己仓库

```
git rm -r --cached .
git config core.autocrlf false
git add .
```

## 回滚代码

```
处理回滚的开发
git reset --hard commit {commitId}
git push --force origin {branchName}
其他小伙伴本地
git reset --hard origin {branchName}
git pull origin {branchName}
```
