//
//
//

package main

import (
	"context"
	"fmt"
	"os"

	"google.golang.org/api/drive/v3"
)

func main() {
	context := context.Background()

	service, err := drive.NewService(context)
	if err != nil {
		fmt.Printf("An error occured: %v\n", err)
		os.Exit(1)
	}

	response, err := service.Files.List().PageSize(10).Fields("nextPageToken, files(id, name)").Do()
	if err != nil {
		fmt.Printf("An error occured: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Files:")
	for _, file := range response.Files {
		fmt.Printf("%s (id: %s)\n", file.Name, file.Id)
	}
}
