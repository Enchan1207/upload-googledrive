//
//
//

package main

import (
	"context"
	"fmt"
	"os"

	"golang.org/x/oauth2"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

func main() {
	context := context.Background()

	var config oauth2.Config

	var token oauth2.Token
	token.AccessToken = os.Getenv("GOOGLE_ACCESS_TOKEN")

	service, err := drive.NewService(context, option.WithHTTPClient(config.Client(context, &token)))
	if err != nil {
		fmt.Printf("An error occured: %v\n", err)
		return
	}

	response, err := service.Files.List().PageSize(10).Fields("nextPageToken, files(id, name)").Do()
	if err != nil {
		fmt.Printf("An error occured: %v\n", err)
		return
	}

	fmt.Println("Files:")
	for _, file := range response.Files {
		fmt.Printf("%s (id: %s)\n", file.Name, file.Id)
	}
}
