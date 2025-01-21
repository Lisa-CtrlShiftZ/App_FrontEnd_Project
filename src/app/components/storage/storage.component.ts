import { Component } from '@angular/core';

@Component({
  selector: 'app-storage',
  imports: [],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})

export class StorageComponent {
  ngOnInit(): void {
    const displayStat = this.displayStat(0.8,0.5,0.3);
    this.foodRequest()
  }
  foodRequest():void {
    // this one is made with the help of ai to quickly do testing since i feared,
    //  i need a translator eventually and currently it does seem like that
    const app_id = "37f64774"; // Your App ID
const app_key = "75127a08bd55149fb3131af961244f1d"; // Your App Key

const url = "https://trackapi.nutritionix.com/v2/natural/nutrients"; // Example endpoint for nutrients

// Define the body of the request (example: food item to be analyzed)
const requestBody = {
  query: "ananas", // Example food item
  timezone: "US/Eastern"
};

// Send the request to Nutritionix API
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-app-id": app_id,
    "x-app-key": app_key
  },
  body: JSON.stringify(requestBody)
})
  .then(response => response.json()) // Parse the response to JSON
  .then(data => {
    console.log("API Response:", data); // Handle the response data
  })
  .catch(error => {
    console.error("Error:", error); // Handle errors
  });
  }

  openSelectionWindow(): void {
    const openButton = document.getElementById('openWindow') as HTMLButtonElement;
    const closeButton = document.getElementById('closeWindow') as HTMLElement;
    const displayWindow = document.getElementById('displayWindow') as HTMLElement;

    const showWindow = () => {
      displayWindow.classList.remove('hidden');
    };

    const hideWindow = () => {
      displayWindow.classList.add('hidden');
    };

    openButton.addEventListener('click', showWindow);
    closeButton.addEventListener('click', hideWindow);
  }

  displayStat(protein_percentage: number,carb_percentage:number,fat_percentage:number): void {
    const circleProtein = document.getElementById("display_amount_of_protein") as HTMLElement;
    const percentageProtein = document.getElementById("protein_percentage")as HTMLElement;
    const circleCarb = document.getElementById("display_amount_of_carb") as HTMLElement;
    const percentageCarb = document.getElementById("carb_percentage")as HTMLElement;
    const circleFat = document.getElementById("display_amount_of_fat") as HTMLElement;
    const percentageFat = document.getElementById("fat_percentage")as HTMLElement;

    if (circleProtein) {
      const strokeDashoffset =251.2- (188.4 * protein_percentage);
      circleProtein.style.strokeDashoffset = strokeDashoffset.toString();
    } 
    if (percentageProtein) {
      percentageProtein.textContent = `${protein_percentage*100} %`;
    }

    if (circleCarb) {
      const strokeDashoffset =251.2- (188.4 * carb_percentage);
      circleCarb.style.strokeDashoffset = strokeDashoffset.toString();
    } 

    if (percentageCarb) {
      percentageCarb.textContent = `${carb_percentage*100} %`;
    }

    if (circleFat) {
      const strokeDashoffset =251.2-(188.4 * fat_percentage);
      circleFat.style.strokeDashoffset = strokeDashoffset.toString();
    } else {
      console.error('Circle element not found!');
    }

    if (percentageFat) {
      percentageFat.textContent = `${fat_percentage*100} %`;
    }
}

  addFood():void{
    const food = {
    name:(document.getElementById("foodName") as HTMLInputElement).value,
    amount:(document.getElementById("foodAmount") as HTMLInputElement).value,
    expiration_date:(document.getElementById("foodExpirationDate") as HTMLInputElement).value}
    this.FoodELement(food)
    // now save this also in local storage and db
  }

  GetallFoodData():void{
    console.log("this funcction is played")
    //const userId = localStorage.getItem('user_id');
    //if (!userId) {
    //  return;
    //}
    const userId = 2
    console.log("userid is correc")
    const foodUserConnections = "http://127.0.0.1:8000/api/user_food"
    let foodConnection: any[] = [];
    
    fetch(foodUserConnections)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`API call failed with status ${response.status}`);
            }
            return response.json(); // Parse the response JSON
        })
        .then((data) => {
            // Filter the data to include only items with the matching user ID
            console.log("food has been found", data)
            foodConnection= data.filter((item: any) => item.user_id === userId);
            console.log("food has been found", foodConnection.length)
            // Display the filtered data
            const container = document.getElementById('storage_container') as HTMLDivElement;
            if (!container) {
                console.error('Storage container not found!');
                return;
            }
            foodConnection.forEach((food) => {
              // Log each food item's details to verify
             this.FoodELement(food)
              console.log(`Food Item - User ID: ${food.user_id}, Expiration Date: ${food.expiration_date}`);
          });
          }
        )
  }


  FoodELement(food: { name: string; amount: string; expiration_date: string }): void {
    console.log('AddBox function triggered');
    const container = document.getElementById('storage_container') as HTMLDivElement;

    if (container) {
        // Create a container for each food element
        const storageElement = document.createElement('div');
        storageElement.id = 'storage_element';

        // Create a wrapper for food details
        const foodDetails = document.createElement('div');
        foodDetails.className = 'food-details';

        const foodExtraData = document.createElement("div")
        foodExtraData.className = "food-extra-data"

        // Food name
        const foodNameLabel = document.createElement("label");
        foodNameLabel.textContent = food.name;
        foodNameLabel.className = 'food-name';

        // Food amount
        const foodAmountLabel = document.createElement("label");
        foodAmountLabel.textContent = food.amount;
        foodAmountLabel.className = 'food-amount';

        // Food expiration date
        const foodExpirationLabel = document.createElement("label");
        foodExpirationLabel.textContent = food.expiration_date;
        foodExpirationLabel.className = 'food-expiration';

        // Append food details to the wrapper
        foodDetails.appendChild(foodNameLabel);
        foodExtraData.appendChild(foodAmountLabel);
        foodExtraData.appendChild(foodExpirationLabel);
        foodDetails.appendChild(foodExtraData)

        // Create buttons container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => {
            const newAmount = prompt('Enter new amount', food.amount);
            const newExpiration = prompt('Enter new expiration date', food.expiration_date);
            if (newAmount) foodAmountLabel.textContent = newAmount;
            if (newExpiration) foodExpirationLabel.textContent = newExpiration;
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            container.removeChild(storageElement);
        });

        // Append buttons to the button container
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        // Append everything to the storage element
        storageElement.appendChild(foodDetails);
        storageElement.appendChild(buttonContainer);

        // Append the storage element to the main container
        container.appendChild(storageElement);

        console.log('Food element added:', food);
    } else {
        console.error('Target div not found!');
    }
  }
}

