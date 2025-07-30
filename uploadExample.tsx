{isLoading ? ( // Loading state
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#F4AB19" />
    <Text type="small_regular" text="Loading baskets..." />
  </View>
) : error ? ( // Error state
  <View style={styles.errorContainer}>
    <View style={styles.gotoCenter}>
    <Text type="emphasized_medium" text="Oops! Something went wrong." />
    <Text type="small_regular" text="Please try again later." />
    </View>
    <Button title="Retry" onPress={refresh} />
  </View>
) : baskets.length === 0 ? ( // Empty state
  <View style={styles.emptyContainer}>
    <View style={styles.gotoCenter}>
    <EmptyState />
    <Text type="small_regular" color="primary40" text="Basket is empty" />
    </View>
    <Button
      title="Browse shops"
      onPress={() => navigation.navigate('CUSTOMER_HOME_SCREEN')}
    />
  </View>
) : ( // Normal state
  baskets.map((basket) => (
    <View key={basket._id} style={styles.basketCard}>
      <View style={styles.basketHeader}>
        <Image uri={ChefLogo} width={31} height={31} bR={15} />
        <View style={{ flex: 1 }}>
          <Text type="body_medium" text={basket.vendor.companyName} color="primary80" />
          <Text type="sub_regular" text="Groceries and fresh vegetables, open till 8" />
        </View>
        <Text type="small_regular" text={`${basket.items.length} items`} color="secondary" />
      </View>
      <View style={styles.buttonRow}>
        <Button
          title="View Basket"
          variant="secondary"
          onPress={() => navigation.navigate('CART_DETAILS_SCREEN', { basket })}
          containerStyle={styles.button}
        />
        <Button
          title="Checkout"
          onPress={() => navigation.navigate('CHECKOUT_SCREEN', { basket })}
          containerStyle={styles.button}
        />
      </View>
    </View>
  ))
)}