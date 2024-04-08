import { useState, useEffect } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import personsService from "./services/persons";
import "./index.css";
import Notification from "./Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    personsService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newPhone };
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${existingPerson.name} is already in the phonebook. Replace the old number with the new one?`
      );
      if (confirmReplace) {
        personsService
          .update(existingPerson.id, newPerson)
          .then(() => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id
                  ? { ...person, number: newPhone }
                  : person
              )
            );
            setMessage(`Added ${newPhone} phone number`);
            setTimeout(() => {
              setMessage("");
            }, 5000);
            setNewName("");
            setNewPhone("");
          })
          .catch(() => {
            setErrorMessage(
              `Information of ${existingPerson.name} has already been removed from the server`
            );
            setTimeout(() => {
              setErrorMessage("");
            }, 5000);
          });
      }
    } else {
      personsService.create(newPerson).then((response) => {
        setPersons(persons.concat(response.data));
        setMessage(`Added ${newPerson.name}`);
        setTimeout(() => {
          setMessage("");
        }, 5000);
        setNewName("");
        setNewPhone("");
      });
    }
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personsService
        .deleteP(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setErrorMessage(
            `Failed to delete ${personToDelete.name}: ${error.message}`
          );
          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Notification message={errorMessage} isError={true} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h2>Add new</h2>
      <PersonForm
        newName={newName}
        newPhone={newPhone}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
