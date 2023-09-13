#
#
#

# ビルドステージ モジュールの依存関係を整理してコンパイル
FROM golang:alpine AS BUILD

WORKDIR /src/
COPY . /src/

RUN go mod tidy
RUN CGO_ENABLED=0 go build -o /bin/main .

# 実行ステージ ビルドステージで生成した実行ファイルを持ってくる
FROM alpine
COPY --from=BUILD /bin/main /bin/main
ENTRYPOINT [ "/bin/main" ]
