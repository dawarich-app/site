export function usePluralForm() {
  return {
    selectMessage(count, messages) {
      const forms = messages.split('|');
      return count === 1 ? forms[0] : forms[forms.length - 1];
    },
  };
}
